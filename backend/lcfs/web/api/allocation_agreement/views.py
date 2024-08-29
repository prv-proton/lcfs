"""
allocation agreements endpoints
"""

from logging import getLogger
from typing import List, Optional, Union

from fastapi import (
    APIRouter,
    Body,
    status,
    Request,
    Response,
    Depends,
    Query,
)
from fastapi_cache.decorator import cache

from lcfs.db import dependencies
from lcfs.web.core.decorators import view_handler
from lcfs.web.api.allocation_agreement.services import AllocationAgreementServices
from lcfs.web.api.allocation_agreement.schema import (
    AllocationAgreementCreateSchema,
    AllocationAgreementSchema,
    AllocationAgreementListSchema,
    #     AllocationAgreementTableOptionsSchema,
    ComplianceReportRequestSchema,
    DeleteAllocationAgreementResponseSchema,
    PaginatedAllocationAgreementRequestSchema,
    #     AllocationAgreementListSchema,
    AllocationAgreementAllSchema
)
from lcfs.web.api.base import PaginationRequestSchema
from lcfs.web.api.allocation_agreement.validation import AllocationAgreementValidation
from lcfs.db.models.user.Role import RoleEnum

router = APIRouter()
logger = getLogger("allocation_agreement_view")
get_async_db = dependencies.get_async_db_session


@router.get(
    "/table-options",
    # response_model=AllocationAgreementTableOptionsSchema,
    status_code=status.HTTP_200_OK
)
@view_handler(['*'])
async def get_table_options(
    request: Request,
    service: AllocationAgreementServices = Depends(),
):
    """Endpoint to retrieve table options related to allocation agreements"""
    return await service.get_table_options()


@router.post("/list-all", response_model=AllocationAgreementAllSchema, status_code=status.HTTP_200_OK)
@view_handler(['*'])
async def get_allocation_agreements(
    request: Request,
    request_data: ComplianceReportRequestSchema = Body(...),
    response: Response = None,
    service: AllocationAgreementServices = Depends(),
):
    """Endpoint to get list of allocation agreements for a compliance report"""
    return await service.get_allocation_agreements(request_data.compliance_report_id)


@router.post(
    "/list",
    response_model=AllocationAgreementListSchema,
    status_code=status.HTTP_200_OK,
)
@view_handler(['*'])
async def get_allocation_agreements_paginated(
    request: Request,
    request_data: PaginatedAllocationAgreementRequestSchema = Body(...),
    service: AllocationAgreementServices = Depends(),
) -> AllocationAgreementListSchema:
    pagination = PaginationRequestSchema(
        page=request_data.page,
        size=request_data.size,
        sort_orders=request_data.sort_orders,
        filters=request_data.filters
    )
    compliance_report_id = request_data.compliance_report_id
    return await service.get_allocation_agreements_paginated(pagination, compliance_report_id)


@router.post(
    "/save",
    response_model=Union[AllocationAgreementSchema,
                         DeleteAllocationAgreementResponseSchema],
    status_code=status.HTTP_200_OK,
)
@view_handler([RoleEnum.SUPPLIER])
async def save_allocation_agreements_row(
    request: Request,
    request_data: AllocationAgreementCreateSchema = Body(...),
    service: AllocationAgreementServices = Depends(),
    validate: AllocationAgreementValidation = Depends(),
):
    """Endpoint to save a single allocation agreements row"""
    compliance_report_id = request_data.compliance_report_id
    allocation_agreement_id: Optional[int] = request_data.allocation_agreement_id

    await validate.validate_organization_access(compliance_report_id)

    if request_data.deleted:
        # Delete existing Allocation agreement
        await validate.validate_compliance_report_id(compliance_report_id, [request_data])
        await service.delete_allocation_agreement(allocation_agreement_id)
        return DeleteAllocationAgreementResponseSchema(message="Allocation agreement deleted successfully")
    elif allocation_agreement_id:
        # Update existing Allocation agreement
        await validate.validate_compliance_report_id(compliance_report_id, [request_data])
        return await service.update_allocation_agreement(request_data)
    else:
        # Create new Allocation agreement
        await validate.validate_compliance_report_id(compliance_report_id, [request_data])
        return await service.create_allocation_agreement(request_data)

@router.get("/search", response_model=List[str], status_code=200)
@view_handler(['*'])
async def search_table_options_strings(
    request: Request,
    transaction_partner: Optional[str] = Query(None, alias="transactionPartner", description="Trading partner (company) for filtering options"),
    service: AllocationAgreementServices = Depends(),
):
    """Endpoint to search allocation agreement options based on a query string"""
    if transaction_partner:
        return await service.search_trading_partner(transaction_partner)
    else:
        return []