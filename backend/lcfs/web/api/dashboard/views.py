from logging import getLogger
from lcfs.db.models.user.Role import RoleEnum
from fastapi import APIRouter, Depends, Request
from lcfs.web.core.decorators import view_handler
from lcfs.web.api.dashboard.services import DashboardServices
from lcfs.web.api.dashboard.schema import DirectorReviewCountsSchema
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
