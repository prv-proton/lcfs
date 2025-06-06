import math
import structlog
from typing import List

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, cast, String

from lcfs.utils.constants import id_prefix_to_transaction_type_map
from lcfs.web.api.user.repo import UserRepository
from lcfs.db.dependencies import get_async_db_session
from lcfs.web.core.decorators import service_handler
from lcfs.web.api.base import (
    FilterModel,
    PaginationRequestSchema,
    PaginationResponseSchema,
    apply_filter_conditions,
    get_field_for_filter,
    validate_pagination,
)
from lcfs.web.exception.exceptions import DataNotFoundException
from lcfs.db.models.transaction.TransactionView import TransactionView
from lcfs.web.api.transaction.schema import TransactionViewSchema
from lcfs.web.api.transaction.repo import TransactionRepository
from lcfs.web.api.user.schema import UsersSchema

logger = structlog.get_logger(__name__)


class OrganizationService:
    def __init__(
        self,
        request: Request = None,
        user_repo: UserRepository = Depends(UserRepository),
        transaction_repo: TransactionRepository = Depends(TransactionRepository),
        session: AsyncSession = Depends(get_async_db_session),
    ) -> None:
        self.transaction_repo = transaction_repo
        self.user_repo = user_repo
        self.request = request
        self.session = session

    def apply_transaction_filters(self, pagination, conditions):
        """
        Apply filters to the transactions query.

        Args:
            pagination (PaginationRequestSchema): The pagination object containing page and size information.
            conditions (List[Condition]): The list of conditions to apply.

        Returns:
            List[Transactions]: The list of transactions after applying the filters.
        """

        for filter in pagination.filters:
            if filter.field == "transaction_id":
                filter_value = filter.filter.upper()
                for (
                    prefix,
                    transaction_type,
                ) in id_prefix_to_transaction_type_map.items():
                    if filter_value.startswith(prefix):
                        numeric_part = filter_value[len(prefix) :]
                        if numeric_part:
                            if numeric_part.isdigit():
                                conditions.append(
                                    and_(
                                        TransactionView.transaction_type
                                        == transaction_type,
                                        TransactionView.transaction_id
                                        == int(numeric_part),
                                    )
                                )
                            else:
                                # Invalid numeric part, add a condition that will never match
                                conditions.append(False)
                        else:
                            # Only prefix provided, filter by transaction type only
                            conditions.append(
                                TransactionView.transaction_type == transaction_type
                            )
                        break
                else:
                    # If no prefix matches, treat the whole value as a potential transaction_id
                    if filter_value.isdigit():
                        conditions.append(
                            TransactionView.transaction_id == int(filter_value)
                        )
                    else:
                        # Invalid input, add a condition that will never match
                        conditions.append(False)
            else:
                # Handle other filters as before
                field = get_field_for_filter(TransactionView, filter.field)
                # Check if the filter is of type "date"
                if filter.filter_type == "date":
                    if filter.type == "inRange":
                        filter_value = [filter.date_from, filter.date_to]
                    else:
                        filter_value = filter.date_from
                else:
                    # For non-date filters, use the standard filter value
                    filter_value = filter.filter

                if field.description == "transaction_type":
                    filter_value = filter_value.replace(" ", "").lower()
                elif filter.field == "status":
                    field = cast(
                        get_field_for_filter(TransactionView, "status"),
                        String,
                    )
                    # Check if filter_value is a comma-separated string
                    if isinstance(filter_value, str) and "," in filter_value:
                        filter_value = filter_value.split(",")  # Convert to list
                    if isinstance(filter_value, list):
                        filter.filter_type = "set"
                        filter.type = "set"

                filter_option = filter.type
                filter_type = filter.filter_type
                conditions.append(
                    apply_filter_conditions(
                        field, filter_value, filter_option, filter_type
                    )
                )

    @service_handler
    async def get_organization_users_list(
        self, organization_id: int, status: str, pagination: PaginationRequestSchema
    ) -> UsersSchema:
        """
        Get all users for the organization
        """
        pagination.filters.append(
            FilterModel(
                filter_type="number",
                field="organization_id",
                type="equals",
                filter=organization_id,
            )
        )
        users, total_count = await self.user_repo.get_users_paginated(
            pagination=pagination
        )
        return UsersSchema(
            pagination=PaginationResponseSchema(
                total=total_count,
                page=pagination.page,
                size=pagination.size,
                total_pages=math.ceil(total_count / pagination.size),
            ),
            users=users,
        )

    @service_handler
    async def get_transactions_paginated(
        self, pagination: PaginationRequestSchema = {}, organization_id: int = None
    ) -> List[TransactionViewSchema]:
        """
        Fetch transactions with filters, sorting, and pagination.
        """
        conditions = []
        pagination = validate_pagination(pagination)
        if pagination.filters and len(pagination.filters) > 0:
            self.apply_transaction_filters(pagination, conditions)

        offset = (pagination.page - 1) * pagination.size if pagination.page > 0 else 0
        limit = pagination.size

        transactions, total_count = (
            await self.transaction_repo.get_transactions_paginated(
                offset, limit, conditions, pagination.sort_orders, organization_id
            )
        )

        return {
            "transactions": [
                TransactionViewSchema.model_validate(transaction)
                for transaction in transactions
            ],
            "pagination": PaginationResponseSchema(
                total=total_count,
                page=pagination.page,
                size=pagination.size,
                total_pages=math.ceil(total_count / pagination.size),
            ),
        }
