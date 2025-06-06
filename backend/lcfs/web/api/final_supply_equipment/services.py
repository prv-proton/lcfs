from sqlalchemy.orm import make_transient
from typing import Any, Coroutine, Sequence

import structlog
import math
import re
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import Row, RowMapping

from lcfs.db.models import UserProfile
from lcfs.db.models.compliance import FinalSupplyEquipment
from lcfs.utils.constants import POSTAL_REGEX
from lcfs.web.api.base import PaginationRequestSchema, PaginationResponseSchema
from lcfs.web.api.compliance_report.repo import ComplianceReportRepository
from lcfs.web.api.final_supply_equipment.schema import (
    FinalSupplyEquipmentCreateSchema,
    FinalSupplyEquipmentsSchema,
    LevelOfEquipmentSchema,
    FinalSupplyEquipmentSchema,
)
from lcfs.web.api.final_supply_equipment.repo import FinalSupplyEquipmentRepository
from lcfs.web.api.fuel_code.schema import EndUseTypeSchema, EndUserTypeSchema
from lcfs.web.api.organizations.repo import OrganizationsRepository
from lcfs.web.core.decorators import service_handler

logger = structlog.get_logger(__name__)


class FinalSupplyEquipmentServices:
    def __init__(
        self,
        repo: FinalSupplyEquipmentRepository = Depends(FinalSupplyEquipmentRepository),
        compliance_report_repo: ComplianceReportRepository = Depends(
            ComplianceReportRepository
        ),
        organization_repo: OrganizationsRepository = Depends(OrganizationsRepository),
    ) -> None:
        self.organization_repo = organization_repo
        self.repo = repo
        self.compliance_report_repo = compliance_report_repo

    @service_handler
    async def get_fse_options(self, user):
        """Fetches all FSE options concurrently."""
        try:
            organization = getattr(user, "organization", None)
            (
                intended_use_types,
                levels_of_equipment,
                intended_user_types,
                ports,
                organization_names,
            ) = await self.repo.get_fse_options(organization)

            return {
                "intended_use_types": [
                    EndUseTypeSchema.model_validate(t) for t in intended_use_types
                ],
                "levels_of_equipment": [
                    LevelOfEquipmentSchema.model_validate(l)
                    for l in levels_of_equipment
                ],
                "intended_user_types": [
                    EndUserTypeSchema.model_validate(u) for u in intended_user_types
                ],
                "ports": ports,
                "organization_names": organization_names,
            }
        except Exception as e:
            logger.error("Error getting FSE options", error=str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error retrieving FSE options",
            )

    async def convert_to_fse_model(self, fse: FinalSupplyEquipmentCreateSchema):
        fse_model = FinalSupplyEquipment(
            **fse.model_dump(
                exclude={
                    "id",
                    "level_of_equipment",
                    "intended_use_types",
                    "intended_user_types",
                    "deleted",
                }
            )
        )
        fse_model.level_of_equipment = await self.repo.get_level_of_equipment_by_name(
            fse.level_of_equipment
        )
        for intended_use in fse.intended_use_types:
            fse_model.intended_use_types.append(
                await self.repo.get_intended_use_by_name(intended_use)
            )
        for intended_user in fse.intended_user_types:
            fse_model.intended_user_types.append(
                await self.repo.get_intended_user_by_name(intended_user)
            )
        return fse_model

    @service_handler
    async def get_fse_list(
        self, compliance_report_id: int
    ) -> FinalSupplyEquipmentsSchema:
        """
        Get the list of FSEs for a given report.
        """
        fse_models = await self.repo.get_fse_list(compliance_report_id)
        fse_list = [await self.map_to_schema(fse) for fse in fse_models]
        return FinalSupplyEquipmentsSchema(final_supply_equipments=fse_list)

    @service_handler
    async def get_final_supply_equipments_paginated(
        self, pagination: PaginationRequestSchema, compliance_report_id: int
    ) -> FinalSupplyEquipmentsSchema:
        """
        Get the list of FSEs for a given report.
        """
        logger.info(
            "Getting paginated FSE list for report",
            compliance_report_id=compliance_report_id,
            page=pagination.page,
            size=pagination.size,
        )
        final_supply_equipments, total_count = await self.repo.get_fse_paginated(
            pagination, compliance_report_id
        )
        return FinalSupplyEquipmentsSchema(
            pagination=PaginationResponseSchema(
                page=pagination.page,
                size=pagination.size,
                total=total_count,
                total_pages=math.ceil(total_count / pagination.size),
            ),
            final_supply_equipments=[
                await self.map_to_schema(fse) for fse in final_supply_equipments
            ],
        )

    @service_handler
    async def update_final_supply_equipment(
        self, fse_data: FinalSupplyEquipmentCreateSchema
    ) -> FinalSupplyEquipmentSchema:
        """Update an existing final supply equipment"""

        existing_fse = await self.repo.get_final_supply_equipment_by_id(
            fse_data.final_supply_equipment_id
        )
        if not existing_fse:
            raise ValueError("final supply equipment not found")

        existing_fse.organization_name = fse_data.organization_name
        existing_fse.kwh_usage = fse_data.kwh_usage
        existing_fse.serial_nbr = fse_data.serial_nbr
        existing_fse.manufacturer = fse_data.manufacturer
        existing_fse.model = fse_data.model

        if existing_fse.level_of_equipment.name != fse_data.level_of_equipment:
            level_of_equipment = await self.repo.get_level_of_equipment_by_name(
                fse_data.level_of_equipment
            )
            existing_fse.level_of_equipment = level_of_equipment
        existing_fse.ports = fse_data.ports
        intended_use_types = []
        for intended_use in fse_data.intended_use_types:
            if intended_use not in [
                intended_use_type.type
                for intended_use_type in existing_fse.intended_use_types
            ]:
                intended_use_type = await self.repo.get_intended_use_by_name(
                    intended_use
                )
                intended_use_types.append(intended_use_type)
            else:
                intended_use_types.append(
                    next(
                        (
                            intended_use_type
                            for intended_use_type in existing_fse.intended_use_types
                            if intended_use_type.type == intended_use
                        ),
                        None,
                    )
                )
        intended_user_types = []
        for intended_user in fse_data.intended_user_types:
            # Check if this intended use is already in the existing list
            existing_user_type = next(
                (
                    existing_user
                    for existing_user in existing_fse.intended_user_types
                    if existing_user.type_name == intended_user
                ),
                None,
            )

            if existing_user_type:
                intended_user_types.append(existing_user_type)
            else:
                # Otherwise, fetch the intended user type by name and add it to the list
                new_user_type = await self.repo.get_intended_user_by_name(intended_user)
                intended_user_types.append(new_user_type)

        existing_fse.supply_from_date = fse_data.supply_from_date
        existing_fse.supply_to_date = fse_data.supply_to_date
        existing_fse.intended_use_types = intended_use_types
        existing_fse.intended_user_types = intended_user_types
        existing_fse.street_address = fse_data.street_address
        existing_fse.city = fse_data.city
        existing_fse.postal_code = fse_data.postal_code
        existing_fse.latitude = fse_data.latitude
        existing_fse.longitude = fse_data.longitude
        existing_fse.notes = fse_data.notes

        updated_equipment = await self.repo.update_final_supply_equipment(existing_fse)
        return await self.map_to_schema(updated_equipment)

    @service_handler
    async def create_final_supply_equipment(
        self, fse_data: FinalSupplyEquipmentCreateSchema, organization_id: int
    ) -> FinalSupplyEquipmentSchema:
        """Create a new final supply equipment"""
        # Generate the registration number

        organization = await self.organization_repo.get_organization(organization_id)
        registration_nbr = await self.generate_registration_number(
            organization.organization_code, fse_data.postal_code
        )

        final_supply_equipment = await self.convert_to_fse_model(fse_data)
        final_supply_equipment.registration_nbr = registration_nbr
        created_equipment = await self.repo.create_final_supply_equipment(
            final_supply_equipment
        )

        # Increment the sequence number for the postal code if creation was successful
        if created_equipment:
            await self.repo.increment_seq_by_org_and_postal_code(
                organization.organization_code, fse_data.postal_code
            )

        return await self.map_to_schema(created_equipment)

    @service_handler
    async def delete_final_supply_equipment(
        self, final_supply_equipment_id: int
    ) -> str:
        """Delete a final supply equipment"""
        return await self.repo.delete_final_supply_equipment(final_supply_equipment_id)

    @service_handler
    async def generate_registration_number(
        self, org_code: str, postal_code: str
    ) -> str:
        """
        Generate a unique registration number for a Final Supply Equipment (FSE).

        The registration number is composed of the organization code, the last three characters of the postal code,
        and a sequential number. The sequential number resets for each new postal code.

        Args:
            org_code (str): The organizations code
            postal_code (str): The postal code of the FSE.

        Returns:
            str: The generated unique registration number.

        Raises:
            ValueError: If the postal code is not a valid Canadian postal code, if the organization ID is not available,
                        or if the maximum registration numbers for the given postal code is exceeded.
        """
        # Validate the postal code format
        postal_code_pattern = re.compile(POSTAL_REGEX)
        if not postal_code_pattern.match(postal_code):
            raise ValueError("Invalid Canadian postal code format")

        # Retrieve the current sequence number for a given postal code
        current_number = await self.repo.get_current_seq_by_org_and_postal_code(
            org_code, postal_code
        )
        next_number = current_number + 1

        # Ensure the sequential number is within the 001-999 range
        if next_number > 999:
            raise ValueError(
                "Exceeded maximum registration numbers for the given postal code"
            )

        formatted_next_number = f"{next_number:03d}"

        # Remove the space in the postal code
        postal_code_no_space = postal_code.replace(" ", "")

        # Concatenate to form the registration number and return it
        return f"{org_code}-{postal_code_no_space}-{formatted_next_number}"

    @service_handler
    async def search_manufacturers(self, query: str) -> Sequence[str]:
        """Search for manufacturers based on the provided query."""
        return await self.repo.search_manufacturers(query)

    @service_handler
    async def get_compliance_report_by_id(self, compliance_report_id: int):
        """Get compliance report by period with status"""
        compliance_report = (
            await self.compliance_report_repo.get_compliance_report_schema_by_id(
                compliance_report_id,
            )
        )

        if not compliance_report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Compliance report not found for this period",
            )

        return compliance_report

    @service_handler
    async def delete_all(self, compliance_report_id: int):
        return await self.repo.delete_all(compliance_report_id)

    @service_handler
    async def map_to_schema(
        self, fse: FinalSupplyEquipment
    ) -> FinalSupplyEquipmentSchema:
        return FinalSupplyEquipmentSchema(
            final_supply_equipment_id=fse.final_supply_equipment_id,
            compliance_report_id=fse.compliance_report_id,
            organization_name=fse.organization_name,
            supply_from_date=fse.supply_from_date,
            supply_to_date=fse.supply_to_date,
            registration_nbr=fse.registration_nbr,
            kwh_usage=fse.kwh_usage,
            serial_nbr=fse.serial_nbr,
            manufacturer=fse.manufacturer,
            model=fse.model,
            level_of_equipment=fse.level_of_equipment.name,
            ports=fse.ports,
            intended_use_types=[use_type.type for use_type in fse.intended_use_types],
            intended_user_types=[
                user_type.type_name for user_type in fse.intended_user_types
            ],
            street_address=fse.street_address,
            city=fse.city,
            postal_code=fse.postal_code,
            latitude=fse.latitude,
            longitude=fse.longitude,
            notes=fse.notes,
        )

    @service_handler
    async def copy_to_report(
        self, original_report_id: int, target_report_id: int, organization_id: int
    ):
        existing_list = await self.get_fse_list(original_report_id)

        for old_fse in existing_list.final_supply_equipments:
            payload = old_fse.model_dump(
                exclude={
                    "final_supply_equipment_id",
                    "level_of_equipment",
                    "compliance_report_id",
                    "intended_use_types",
                    "intended_user_types",
                }
            )
            new_fse = FinalSupplyEquipmentCreateSchema(
                **payload,
                level_of_equipment=old_fse.level_of_equipment,
                intended_use_types=[use_type for use_type in old_fse.intended_use_types],
                intended_user_types=[user_type for user_type in old_fse.intended_user_types],
                compliance_report_id=target_report_id,
            )

            await self.create_final_supply_equipment(new_fse, organization_id)
