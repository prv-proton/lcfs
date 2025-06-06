# Database Connection Management

## Overview

This document explains the database connection pool configuration, connection usage patterns, and concurrent user capacity for the LCFS application.

## Connection Pool Configuration

The application uses SQLAlchemy's async connection pool with the following settings:

```python
# Located in: backend/lcfs/db/dependencies.py and backend/lcfs/web/lifetime.py
async_engine = create_async_engine(
    db_url,
    future=True,
    pool_size=30,           # Base connection pool size (reduced from 50)
    max_overflow=50,        # Additional connections beyond pool_size (reduced from 100)
    pool_pre_ping=True,     # Test connections before use
    pool_recycle=3600,      # Recycle connections every hour
    pool_timeout=30,        # Wait time for connection (seconds)
    pool_reset_on_return='commit',  # Clean connection state on return
)
```

### Pool Settings Explained

- **Total Available Connections**: 80 (30 base + 50 overflow) - **SAFE within DB limit of 100**
- **Reserved for System**: 20 connections left for PostgreSQL internal operations, monitoring, backups
- **Connection Lifecycle**: Connections are recycled every hour to prevent stale connections
- **Health Checks**: `pool_pre_ping=True` ensures connections are valid before use
- **Timeout**: Requests wait up to 30 seconds for an available connection
- **Clean State**: `pool_reset_on_return='commit'` ensures connections are reset to a clean state when returned to the pool

### Database Capacity Considerations

**Current Database Settings:**
- PostgreSQL `max_connections = 100`
- No PgBouncer connection pooling
- Each application connection = 1 database connection

**Why We Use 80 Total Connections:**
- Leaves 20 connections for PostgreSQL system operations
- Prevents connection exhaustion errors
- Allows for monitoring tools and manual admin connections
- Provides safety buffer for connection spikes

#### Connection Reset Behavior (`pool_reset_on_return='commit'`)

This critical setting ensures database connection hygiene by automatically executing a **COMMIT** statement when each connection is returned to the pool.

**Why this matters:**
- **Prevents transaction conflicts**: Eliminates leftover transaction state that could cause "cannot use Connection.transaction()" errors
- **Ensures clean connections**: Each new request gets a fresh connection without uncommitted transactions
- **Improves reliability**: Reduces random 500 errors caused by transaction state conflicts
- **Performance safety**: COMMIT is faster than ROLLBACK and safer than no reset

**Without this setting:**
- Connections might be returned with uncommitted transactions
- Next user gets a "dirty" connection with leftover transaction state
- Can cause the exact transaction conflicts we experienced
- Potential for data inconsistency between requests

**Alternative values:**
```python
pool_reset_on_return='commit'     # Execute COMMIT (our choice - safest)
pool_reset_on_return='rollback'   # Execute ROLLBACK (more aggressive reset)
pool_reset_on_return=None         # No reset (risky, not recommended)
```

This setting is particularly important in our architecture because we have multiple requests sharing the connection pool, authentication and main requests using separate connections, and background operations also accessing the pool.

## Connection Usage Per Request

### Main Application Request
Each API request uses **2 database connections**:

1. **Authentication Connection** (1 connection)
   - User lookup and validation
   - Login history tracking
   - Duration: 2-5 milliseconds
   - Managed in: `backend/lcfs/services/keycloak/authentication.py`

2. **Main Request Connection** (1 connection)
   - Business logic operations
   - Data queries and updates
   - Duration: Varies by endpoint complexity
   - Managed in: `backend/lcfs/db/dependencies.py`

### Background Operations
Some operations create additional connections:

- **RabbitMQ Consumer**: 1 connection per message processing
- **File Import Jobs**: 1 connection per import (runs in thread pool)
- **Redis Balance Cache**: 1 connection during app startup

## Concurrent User Capacity

With the current pool configuration:

### Theoretical Maximum
- **80 total connections ÷ 2 connections per request = 40 concurrent requests**

### Practical Capacity
Accounting for background operations and safety margins:

- **Recommended Concurrent Users**: 30-35
- **Peak Burst Capacity**: 40-45 concurrent requests
- **Background Operations Reserve**: 5-10 connections

### Performance Characteristics

| Concurrent Users | Connection Usage | Performance | Status |
|-----------------|------------------|-------------|---------|
| 1-20            | 40 connections  | Optimal     | ✅ Safe |
| 21-30           | 60 connections  | Good        | ✅ Safe |
| 31-35           | 70 connections  | Acceptable  | ⚠️ Monitor |
| 36-40           | 80 connections  | Peak Load   | ⚠️ At Limit |
| 40+             | Pool Exhausted  | Degraded    | ❌ Unsafe |

**⚠️ CRITICAL**: With database `max_connections = 100`, we must stay under 40 concurrent users to avoid connection exhaustion.

## Connection Lifecycle

### Request Flow
```
1. Request arrives → Authentication starts
2. Authentication creates session → User lookup (2-5ms)
3. Authentication completes → Connection returned to pool
4. Main request handler starts → Business logic
5. Request completes → Connection returned to pool
```

### Session Management
```python
# Authentication (fast, read-only)
async with session_factory() as session:
    async with session.begin():
        # User lookup and login history
        # Auto-commit on success, rollback on error

# Main Request (variable duration)
async with AsyncSession(async_engine) as session:
    async with session.begin():
        # Business logic operations
        # Auto-commit on success, rollback on error
```

## Monitoring and Troubleshooting

### Key Metrics to Monitor
- **Active Connections**: Should stay below 130 under normal load
- **Connection Wait Time**: Should be minimal (< 100ms)
- **Pool Overflow Usage**: Indicates high load when > 50
- **Connection Errors**: "QueuePool limit exceeded" indicates pool exhaustion

### Common Issues and Solutions

#### Random 500 Errors
**Symptoms**: Intermittent "cannot use Connection.transaction()" errors
**Causes**: 
- Connection pool exhaustion
- Nested transaction conflicts
- Long-running queries holding connections

**Solutions**:
- Monitor concurrent user count
- Check for slow queries
- Verify proper session management

#### High Connection Usage
**Symptoms**: Slow response times, connection timeouts
**Causes**:
- Too many concurrent users
- Background jobs consuming connections
- Connection leaks

**Solutions**:
- Scale horizontally (add more app instances)
- Optimize slow queries
- Review background job scheduling

## Scaling Recommendations

### Immediate Actions Required

**1. Update Application Configuration**
```python
# Update both files with safer settings:
# - backend/lcfs/db/dependencies.py  
# - backend/lcfs/web/lifetime.py

pool_size=30,        # Reduced from 50
max_overflow=50,     # Reduced from 100
```

**2. Database Options to Consider**

**Option A: Increase Database Connections (Simple)**
```sql
-- In postgresql.conf
max_connections = 200  # Double current capacity
```
- Pros: Simple, allows current app config
- Cons: Uses more memory (~2.5MB per connection)

**Option B: Install PgBouncer (Recommended)**
```
# PgBouncer configuration example
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```
- Pros: Much higher concurrent user capacity, efficient resource usage
- Cons: Requires setup and configuration

**Option C: Hybrid Approach**
- Increase `max_connections` to 150-200
- Install PgBouncer for future scaling
- Keep app pool at safe levels

### Horizontal Scaling
For higher concurrent user loads:
- Deploy multiple app instances behind a load balancer
- Each instance maintains its own connection pool
- Database can handle multiple connection pools

### Vertical Scaling
To increase single-instance capacity:
```python
# Increase pool settings (with caution)
pool_size=75,        # Increase base pool
max_overflow=150,    # Increase overflow
```
**Note**: Ensure database server can handle increased connections

### Database Scaling
- Monitor database connection limits
- Consider read replicas for read-heavy operations
- Implement connection pooling at database level (PgBouncer)

## Best Practices

### For Developers
1. **Always use context managers** (`async with`) for sessions
2. **Keep transactions short** - avoid long-running operations
3. **Don't create manual sessions** - use dependency injection
4. **Handle exceptions properly** - ensure connections are released

### For Operations
1. **Monitor connection pool metrics** regularly
2. **Set up alerts** for high connection usage (> 80%)
3. **Load test** before deploying to production
4. **Plan capacity** based on expected concurrent users

## Configuration Files

The connection pool is configured in two locations:

1. **`backend/lcfs/db/dependencies.py`** - Main application engine
2. **`backend/lcfs/web/lifetime.py`** - Application startup engine

Both should maintain identical settings to ensure consistency.

---

*Last Updated: December 2024*
*For questions or issues, contact the development team.* 