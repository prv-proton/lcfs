from logging import getLogger
from lcfs.db.models.user.Role import RoleEnum
from fastapi import APIRouter, Depends, Request
from lcfs.web.core.decorators import view_handler
from lcfs.web.api.dashboard.services import DashboardServices
from lcfs.web.api.dashboard.schema import (
    DirectorReviewCountsSchema,
    TransactionCountsSchema,
    OrganizarionTransactionCountsSchema
)
from lcfs.db.models.user.Role import RoleEnum

router = APIRouter()
logger = getLogger("dashboard_view")

@router.get("/director-review-counts", response_model=DirectorReviewCountsSchema)
@view_handler([RoleEnum.DIRECTOR])
async def get_director_review_counts(
    request: Request,
    service: DashboardServices = Depends(),
):
    """Endpoint to retrieve counts for director review items"""
    return await service.get_director_review_counts()

@router.get("/transaction-counts", response_model=TransactionCountsSchema)
@view_handler([RoleEnum.ANALYST, RoleEnum.COMPLIANCE_MANAGER])
async def get_transaction_counts(
    request: Request,
    service: DashboardServices = Depends(),
):
    """Endpoint to retrieve counts for transaction items"""
    return await service.get_transaction_counts()

@router.get("/org-transaction-counts", response_model=OrganizarionTransactionCountsSchema)
@view_handler([RoleEnum.TRANSFER])
async def get_org_transaction_counts(
    request: Request,
    service: DashboardServices = Depends(),
):
    """Endpoint to retrieve counts for organizarion transaction items"""
    organization_id = request.user.organization.organization_id
    return await service.get_org_transaction_counts(organization_id)
