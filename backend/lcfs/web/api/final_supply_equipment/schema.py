from typing import Optional, List
from datetime import date

from lcfs.web.api.base import BaseSchema
from lcfs.web.api.compliance_report.schema import FinalSupplyEquipmentSchema
from lcfs.web.api.fuel_code.schema import EndUseTypeSchema

class FuelMeasurementTypeSchema(BaseSchema):
    fuel_measurement_type_id: int
    type: str
    description: Optional[str] = None
    display_order: int


class LevelOfEquipmentSchema(BaseSchema):
    level_of_equipment_id: int
    name: str
    description: Optional[str] = None
    display_order: int


class FSEOptionsSchema(BaseSchema):
    intended_use_types: List[EndUseTypeSchema]
    fuel_measurement_types: List[FuelMeasurementTypeSchema]
    levels_of_equipment: List[LevelOfEquipmentSchema]


class FinalSupplyEquipmentCreateSchema(BaseSchema):
    final_supply_equipment_id: Optional[int] = None
    compliance_report_id: Optional[int] = None
    supply_from_date: date
    supply_to_date: date
    serial_nbr: str
    manufacturer: str
    level_of_equipment: str | LevelOfEquipmentSchema
    fuel_measurement_type: str | FuelMeasurementTypeSchema
    intended_uses: List[str] | List[EndUseTypeSchema]
    street_address: str
    city: str
    postal_code: str
    latitude: float
    longitude: float
    notes: Optional[str] = None
    deleted: Optional[bool] = None

class DeleteFinalSupplyEquipmentResponseSchema(BaseSchema):
    message: str


class FinalSupplyEquipmentsSchema(BaseSchema):
    final_supply_equipments: Optional[List[FinalSupplyEquipmentSchema]] = []
