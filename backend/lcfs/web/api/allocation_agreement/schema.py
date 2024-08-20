from typing import Optional, List
from pydantic import Field, field_validator
from lcfs.web.api.base import BaseSchema, FilterModel, SortOrder, PaginationRequestSchema, PaginationResponseSchema
from enum import Enum


class AllocationTransactionTypeSchema(BaseSchema):
    allocation_transaction_type_id: int
    type: str


class FuelTypeSchema(BaseSchema):
    fuel_type_id: int
    fuel_type: str


class FuelCategorySchema(BaseSchema):
    fuel_category_id: int
    category: str


class ProvisionOfTheActSchema(BaseSchema):
    provision_of_the_act_id: int
    name: str


class FuelCodeSchema(BaseSchema):
    fuel_code_id: int
    fuel_code: str


class AllocationAgreementTableOptionsSchema(BaseSchema):
    allocation_transaction_types: List[AllocationTransactionTypeSchema]
    fuel_types: List[FuelTypeSchema]
    fuel_categories: List[FuelCategorySchema]
    provisions_of_the_act: List[ProvisionOfTheActSchema]
    fuel_codes: List[FuelCodeSchema]
    units_of_measure: List[str]


class AllocationAgreementCreateSchema(BaseSchema):
    allocation_agreement_id: Optional[int] = None
    transaction_partner: str
    transaction_partner_email: str
    transaction_partner_phone: str
    postal_address: str
    ci_fuel: int
    quantity: int
    units: str
    compliance_report_id: int

    allocation_transaction_type: str
    fuel_type: str
    fuel_category: str
    provision_of_the_act: str
    fuel_code: str

    deleted: Optional[bool] = None


class AllocationAgreementSchema(AllocationAgreementCreateSchema):
    pass


class AllocationAgreementAllSchema(BaseSchema):
    allocation_agreements: List[AllocationAgreementSchema]


class ComplianceReportRequestSchema(BaseSchema):
    compliance_report_id: int


class AllocationAgreementListSchema(BaseSchema):
    allocation_agreements: List[AllocationAgreementSchema]
    pagination: PaginationResponseSchema


class PaginatedAllocationAgreementRequestSchema(BaseSchema):
    compliance_report_id: int = Field(..., alias="complianceReportId")
    filters: List[FilterModel]
    page: int
    size: int
    sort_orders: List[SortOrder]


class DeleteAllocationAgreementsSchema(BaseSchema):
    allocation_agreement_id: int
    compliance_report_id: int


class DeleteAllocationAgreementResponseSchema(BaseSchema):
    message: str
