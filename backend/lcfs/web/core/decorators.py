import inspect
from functools import wraps
from logging import getLogger
from typing import List, Union, Literal
import warnings

from fastapi import HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from lcfs.db.models.user.UserRole import UserRole
from lcfs.db.models.user.Role import RoleEnum
from lcfs.web.exception.exceptions import ServiceException, DatabaseException, DataNotFoundException


def custom_formatwarning(message, category, filename, lineno, line=None):
    # Yellow text for the warning
    return f'\033[93m{filename}:{lineno}: {category.__name__}: {message}\033[0m\n'


warnings.formatwarning = custom_formatwarning
# warnings.simplefilter('always')


# def role_enum_member(role):
#     # If role is a RoleEnum member, return it directly
#     if isinstance(role, RoleEnum):
#         return role
#     # If role is a UserRole object, convert its role attribute to RoleEnum member
#     if isinstance(role, UserRole):
#         return RoleEnum[role.role.name.name]  # TODO refactor
#     # Otherwise, raise an error
#     raise ValueError(f"Invalid role type: {type(role)}")


# def roles_required(*required_roles):
#     def decorator(func):
#         @wraps(func)
#         async def wrapper(request: Request, *args, **kwargs):
#             user = getattr(request, "user", None)

#             if not user:
#                 raise HTTPException(
#                     status_code=401, detail="User not authenticated")

#             # Extract the role names or enum members from the user_roles attribute
#             user_roles = {role_enum_member(
#                 role) for role in user.user_roles}

#             # Convert required_roles to a set of RoleEnum members
#             required_role_set = {RoleEnum[role.upper()]
#                                  for role in required_roles}

#             # Check if user has all the required roles
#             if not (user_roles & required_role_set):
#                 raise HTTPException(
#                     status_code=403, detail="Insufficient permissions")

#             orgId = kwargs.get("organization_id", None)
#             if (RoleEnum.SUPPLIER in user_roles and
#                     orgId and int(orgId) != user.organization_id):
#                 raise HTTPException(
#                     status_code=403, detail="Insufficient permissions for this organization")

#             return await func(request, *args, **kwargs)

#         return wrapper
#     return decorator


def view_handler(required_roles: List[Union[RoleEnum, Literal['*']]]):
    '''Handles try except in the view layer'''

    # check if required roles argument was passed
    if not required_roles or not isinstance(required_roles, list):
        raise ValueError("required_roles must be a non-empty list")

    # check if a valid role was passed
    for role in required_roles:
        if role != '*' and not isinstance(role, RoleEnum):
            raise ValueError(f"Invalid role: {role}. Must be RoleEnum or '*'")

    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            logger = getLogger(func.__module__)
            user = getattr(request, "user", None)

            # check if user is authenticated
            if not user:
                raise HTTPException(
                    status_code=401, detail="User not authenticated")

            # check if the endpoint can be accessed
            if '*' in required_roles:
                warnings.warn('This endpoint is accessible by all roles')
            else:
                user_roles = {RoleEnum[role.role.name.name]
                              for role in user.user_roles}

                # Check if user has all the required roles
                if not any(role in user_roles for role in required_roles):
                    raise HTTPException(
                        status_code=403, detail="Insufficient permissions")

                orgId = kwargs.get("organization_id", None)
                if (RoleEnum.SUPPLIER in user_roles and
                        orgId and int(orgId) != user.organization_id):
                    raise HTTPException(
                        status_code=403, detail="Insufficient permissions for this organization")

            # run through the view function
            try:
                return await func(request, *args, **kwargs)
            except (DatabaseException, ServiceException) as e:
                logger.error(str(e))
                raise HTTPException(
                    status_code=500, detail=f"Internal Server Error")
            except HTTPException as e:
                logger.error(str(e))
                raise
            except DataNotFoundException:
                raise HTTPException(
                    status_code=404, detail=f"Not Found")
            except Exception as e:
                file_path = inspect.getfile(func)
                func_name = func.__name__
                logger.error(f'''View error in {func_name} (file: {
                             file_path}) - {e}''', exc_info=True)
                raise HTTPException(
                    status_code=500, detail=f"Internal Server Error")
        return wrapper
    return decorator


def service_handler(func):
    '''Handles try except in the service layer'''
    @wraps(func)
    async def wrapper(*args, **kwargs):
        logger = getLogger(func.__module__)
        try:
            return await func(*args, **kwargs)

        # raise the error to the view layer
        except (DatabaseException, HTTPException, DataNotFoundException):
            raise
        # all other errors that occur in the service layer will log an error
        except Exception as e:
            file_path = inspect.getfile(func)
            func_name = func.__name__
            logger.error(f'''Service error in {func_name} (file: {
                         file_path}) - {e}''', exc_info=True)
            raise ServiceException
    return wrapper


def repo_handler(func):
    '''Handles try except in the repo layer'''
    @wraps(func)
    async def wrapper(*args, **kwargs):
        logger = getLogger(func.__module__)
        try:
            return await func(*args, **kwargs)
        # raise the error to the service layer
        except (HTTPException, DataNotFoundException):
            raise
        # all exceptions will trigger a DatabaseError and cause a 500 response in the view layer
        except Exception as e:
            file_path = inspect.getfile(func)
            func_name = func.__name__
            logger.error(f'''Repo error in {func_name} (file: {
                         file_path}) - {e}''', exc_info=True)
            raise DatabaseException
    return wrapper
