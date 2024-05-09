from lcfs.web.api.base import BaseSchema, validator
from typing import Optional, List
from datetime import date, datetime

class InitiativeAgreementStatusSchema(BaseSchema):
    initiative_agreement_status_id: int
    status: str

    class Config:
        from_attributes = True

class HistoryUserSchema(BaseSchema):
    first_name: str
    last_name: str

    class Config:
        from_attributes = True

class InitiativeAgreementHistorySchema(BaseSchema):
    create_date: datetime
    initiative_agreement_status: InitiativeAgreementStatusSchema
    user_profile: HistoryUserSchema

    class Config:
        from_attributes = True

class InitiativeAgreementBaseSchema(BaseSchema):
    compliance_units: int
    current_status: InitiativeAgreementStatusSchema
    transaction_effective_date: date
    to_organization_id: int
    gov_comment: Optional[str] = None

    @validator('compliance_units')
    def validate_compliance_units(cls, v):
        if v <= 0:
            raise ValueError('compliance_units must be positive')
        return v

    class Config:
        from_attributes = True

class InitiativeAgreementSchema(InitiativeAgreementBaseSchema):
    initiative_agreement_id: int
    history: Optional[List[InitiativeAgreementHistorySchema]]

class InitiativeAgreementCreateSchema(InitiativeAgreementBaseSchema):
    current_status: str

class InitiativeAgreementUpdateSchema(InitiativeAgreementBaseSchema):
    initiative_agreement_id: int
    current_status: str
