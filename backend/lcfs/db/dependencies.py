from functools import wraps
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from redis import asyncio as aioredis

from lcfs.settings import settings

db_url = make_url(str(settings.db_url.with_path(f"/{settings.db_base}")))
engine = create_engine(db_url)
async_engine = create_async_engine(db_url, future=True, echo=True)
app = FastAPI()
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


def get_db_session():
    """
    Create and get database session.
    :yield: database session.
    """
    session: SessionLocal = SessionLocal()

    try:  # noqa: WPS501
        yield session
    finally:
        session.commit()
        session.close()


async def get_async_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create and get database session.
    :yield: database session.
    """
    session: AsyncSession = AsyncSession(async_engine)

    try:  # noqa: WPS501
        yield session
    finally:
        await session.commit()
        await session.close()


def transactional(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        db: AsyncSession = kwargs.get("db")
        if not db:
            raise HTTPException(
                status_code=500, detail="Database session not available"
            )

        try:
            result = None
            async with db.begin():
                result = await func(*args, **kwargs)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return wrapper


def create_redis():
    return aioredis.ConnectionPool(
        host=settings.redis_host,
        port=settings.redis_port,
        db=settings.redis_db,
        decode_responses=True,
    )


pool = create_redis()
