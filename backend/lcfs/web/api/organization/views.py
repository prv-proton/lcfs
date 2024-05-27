from logging import getLogger

from fastapi import (
    APIRouter,
    Body,
    Depends,
    Query,
    Response,
    status,
    Request,
)
from fastapi.responses import StreamingResponse
from starlette import status

from lcfs.db import dependencies
from lcfs.web.core.decorators import roles_required, view_handler
from lcfs.web.api.base import PaginationRequestSchema
from lcfs.web.api.user.schema import UserBaseSchema, UserCreateSchema, UsersSchema
from lcfs.db.models.user.UserProfile import UserProfile
from lcfs.db.models.transfer.Transfer import Transfer
from lcfs.db.models.transfer.TransferStatus import TransferStatusEnum
from lcfs.web.api.transfer.schema import (
    TransferCreateSchema,
    TransferSchema,
)
from lcfs.web.api.transaction.schema import TransactionListSchema
from lcfs.web.api.transaction.services import TransactionsService
from lcfs.web.api.user.services import UserServices
from .services import OrganizationService
from .validation import OrganizationValidation
from lcfs.web.api.transfer.services import TransferServices


logger = getLogger("organization_view")
router = APIRouter()
get_async_db = dependencies.get_async_db_session


@router.post(
    "/{organization_id}/users/list",
    response_model=UsersSchema,
    status_code=status.HTTP_200_OK,
)
@roles_required("Supplier", "Government")
@view_handler
async def get_org_users(
    request: Request,
    organization_id: int,
    status: str = Query(default="Active", description="Active or Inactive users list"),
    pagination: PaginationRequestSchema = Body(..., embed=False),
    response: Response = None,
    org_service: OrganizationService = Depends(),
):
    """
    Enpoint to get information of all users related to organization for ag-grid in the UI

    Pagination Request Schema:
    - page: offset/ page indicates the pagination of rows for the users list
    - size: size indicates the number of rows per page for the users list
    - sortOrders: sortOrders is an array of objects that specify the sorting criteria for the users list.
        Each object has the following properties:
        - field: the name of the field to sort by
        - direction: the sorting direction ('asc' or 'desc')
    - filterModel: filterModel is an array of objects that specifies the filtering criteria for the users list.
        It has the following properties:
        - filter_type: the type of filtering to perform ('text', 'number', 'date', 'boolean')
        - type: the type of filter to apply ('equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith')
        - filter: the actual filter value
        - field: Database Field that needs filtering.
    """
    return await org_service.get_organization_users_list(
        organization_id, status, pagination
    )


@router.get(
    "/{organization_id}/users/{user_id}",
    response_model=UserBaseSchema,
    status_code=status.HTTP_200_OK,
)
@roles_required("Supplier")
@view_handler
async def get_user_by_id(
    request: Request,
    organization_id: int,
    response: Response = None,
    user_id: int = None,
    user_service: UserServices = Depends(),
) -> UserBaseSchema:
    """
    Endpoint to get information of a user by ID
    This endpoint returns the information of a user by ID, including their roles and organization.
    """
    return await user_service.get_user_by_id(user_id)


@router.post(
    "/{organization_id}/users", response_model=None, status_code=status.HTTP_201_CREATED
)
@roles_required("Supplier")
@view_handler
async def create_user(
    request: Request,
    organization_id: int,
    response: Response = None,
    user_create: UserCreateSchema = ...,
    user_service: UserServices = Depends(),
) -> UserProfile:
    """
    Endpoint to create a new user
    This endpoint creates a new user and returns the information of the created user.
    """
    user_create.organization_id = organization_id
    return await user_service.create_user(user_create)


# TODO Check if security concern exists on user creating user in different org
@router.put(
    "/{organization_id}/users/{user_id}",
    response_model=UserBaseSchema,
    status_code=status.HTTP_200_OK,
)
@roles_required("Supplier")
@view_handler
async def update_user(
    request: Request,
    organization_id: int,
    response: Response = None,
    user_id: int = None,
    user_create: UserCreateSchema = ...,
    user_service: UserServices = Depends(),
) -> UserBaseSchema:
    """
    Endpoint to update a user
    This endpoint updates a user and returns the information of the updated user.
    """
    user_create.organization_id = organization_id
    await user_service.update_user(user_create, user_id)
    return await user_service.get_user_by_id(user_id)


@router.post(
    "/transactions",
    response_model=TransactionListSchema,
    status_code=status.HTTP_200_OK,
)
@roles_required("Supplier")
@view_handler
async def get_transactions_paginated_for_org(
    request: Request,
    pagination: PaginationRequestSchema = Body(..., embed=False),
    org_service: OrganizationService = Depends(),
    response: Response = None,
):
    """
    Fetches a combined list of Issuances and Transfers, sorted by create_date, with pagination.
    """
    organization_id = request.user.organization.organization_id
    paginated_transactions = await org_service.get_transactions_paginated(pagination, organization_id)
    # for Organizations hide Recommended status.
    for transaction in paginated_transactions['transactions']:
        if transaction.status == TransferStatusEnum.Recommended.value:
            transaction.status = TransferStatusEnum.Submitted.name
    return paginated_transactions

@router.get("/transactions/export", response_class=StreamingResponse, status_code=status.HTTP_200_OK)
@roles_required("Supplier")
@view_handler
async def export_transactions_for_org(
    request: Request,
    format: str = Query(default="xls", description="File export format"),
    txn_service: TransactionsService = Depends(),
):
    """
    Endpoint to export information of all transactions for a specific organization
    """
    organization_id = request.user.organization.organization_id
    return await txn_service.export_transactions(format, organization_id)

@router.post(
    "/{organization_id}/transfers",
    response_model=TransferSchema,
    status_code=status.HTTP_201_CREATED,
)
@roles_required("Supplier")
@view_handler
async def create_transfer(
    request: Request,
    organization_id: int,
    transfer_create: TransferCreateSchema = ...,
    transfer_service: TransferServices = Depends(),
    validate: OrganizationValidation = Depends(),
):
    """
    Endpoint to create a new transfer
    This endpoint creates a new transfer and returns the information of the created transfer.
    """
    await validate.create_transfer(organization_id, transfer_create)
    return await transfer_service.create_transfer(transfer_create)


@router.put(
    "/{organization_id}/transfers/{transfer_id}",
    response_model=TransferSchema,
    status_code=status.HTTP_201_CREATED,
)
@roles_required("Supplier")
@view_handler
async def update_transfer(
    request: Request,
    organization_id: int,
    transfer_id: int,
    transfer_create: TransferCreateSchema = ...,
    transfer_service: TransferServices = Depends(),
    validate: OrganizationValidation = Depends(),
) -> Transfer:
    """
    Endpoint to create a new transfer
    This endpoint creates a new transfer and returns the information of the created transfer.
    """
    validate.update_transfer(organization_id, transfer_create)
    transfer_create.transfer_id = transfer_id
    return await transfer_service.update_transfer(transfer_create)
