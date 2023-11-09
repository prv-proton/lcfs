from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from lcfs.db.base import BaseModel, Auditable, DisplayOrder
import enum

class OrgTypeEnum(enum.Enum):
    fuel_supplier = "Fuel Supplier"
    electricity_supplier = "Electricity Supplier"
    broker = "Broker"
    utilities = "Utilities (local or public)"

class OrganizationType(BaseModel, Auditable, DisplayOrder):

    __tablename__ = 'organization_type'
    __table_args__ = {'comment': "Represents a Organization types"}

    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=False)
    type = Column(Enum(OrgTypeEnum, name="org_type_enum", create_type=True), default=OrgTypeEnum.fuel_supplier, comment="Organization's Types")
    description = Column(String(500), nullable=True, comment="Organization Types")

    organization = relationship('Organization', back_populates='org_type')