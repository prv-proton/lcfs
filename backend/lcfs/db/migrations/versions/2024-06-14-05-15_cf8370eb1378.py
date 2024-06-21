"""Final supply equipment model

Revision ID: cf8370eb1378
Revises: r42e3c9va810
Create Date: 2024-06-14 05:15:43.474840

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "cf8370eb1378"
down_revision = "r42e3c9va810"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "fuel_measurement_type",
        sa.Column(
            "fuel_measurement_type_id",
            sa.Integer(),
            autoincrement=True,
            nullable=False,
            comment="Unique identifier for the fuel measurement type",
        ),
        sa.Column(
            "type",
            sa.String(),
            nullable=False,
            comment="Name of the fuel measurement type",
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
            comment="Description of the fuel measurement type",
        ),
        sa.Column(
            "create_date",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
            comment="Date and time (UTC) when the physical record was created in the database.",
        ),
        sa.Column(
            "update_date",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
            comment="Date and time (UTC) when the physical record was updated in the database. It will be the same as the create_date until the record is first updated after creation.",
        ),
        sa.Column(
            "create_user",
            sa.String(),
            nullable=True,
            comment="The user who created this record in the database.",
        ),
        sa.Column(
            "update_user",
            sa.String(),
            nullable=True,
            comment="The user who last updated this record in the database.",
        ),
        sa.Column(
            "display_order",
            sa.Integer(),
            nullable=True,
            comment="Relative rank in display sorting order",
        ),
        sa.PrimaryKeyConstraint("fuel_measurement_type_id"),
        comment="Fuel measurement type",
    )
    op.create_table(
        "level_of_equipment",
        sa.Column(
            "level_of_equipment_id", sa.Integer(), autoincrement=True, nullable=False
        ),
        sa.Column("name", sa.String(length=500), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "create_date",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
            comment="Date and time (UTC) when the physical record was created in the database.",
        ),
        sa.Column(
            "update_date",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
            comment="Date and time (UTC) when the physical record was updated in the database. It will be the same as the create_date until the record is first updated after creation.",
        ),
        sa.Column(
            "create_user",
            sa.String(),
            nullable=True,
            comment="The user who created this record in the database.",
        ),
        sa.Column(
            "update_user",
            sa.String(),
            nullable=True,
            comment="The user who last updated this record in the database.",
        ),
        sa.Column(
            "display_order",
            sa.Integer(),
            nullable=True,
            comment="Relative rank in display sorting order",
        ),
        sa.PrimaryKeyConstraint("level_of_equipment_id"),
        comment="Represents a level of equipment for fuel supply equipments",
    )
    op.create_table(
        "final_supply_equipment",
        sa.Column(
            "final_supply_equipment_id",
            sa.Integer(),
            autoincrement=True,
            nullable=False,
            comment="The unique identifier for the final supply equipment.",
        ),
        sa.Column(
            "compliance_report_id",
            sa.Integer(),
            nullable=False,
            comment="The foreign key referencing the compliance report.",
        ),
        sa.Column(
            "supply_from_date",
            sa.Date(),
            nullable=False,
            comment="The date from which the equipment is supplied.",
        ),
        sa.Column(
            "supply_to_date",
            sa.Date(),
            nullable=False,
            comment="The date until which the equipment is supplied.",
        ),
        sa.Column(
            "serial_nbr",
            sa.String(),
            nullable=False,
            comment="The serial number of the equipment.",
        ),
        sa.Column(
            "manufacturer",
            sa.String(),
            nullable=False,
            comment="The manufacturer of the equipment.",
        ),
        sa.Column(
            "level_of_equipment_id",
            sa.Integer(),
            nullable=False,
            comment="The foreign key referencing the level of equipment.",
        ),
        sa.Column(
            "fuel_measurement_type_id",
            sa.Integer(),
            nullable=False,
            comment="The foreign key referencing the fuel measurement type.",
        ),
        sa.Column(
            "intended_use_id",
            sa.Integer(),
            nullable=False,
            comment="The foreign key referencing the end use type to represent intended use.",
        ),
        sa.Column(
            "street_address",
            sa.String(),
            nullable=False,
            comment="The street address of the equipment location.",
        ),
        sa.Column(
            "city",
            sa.String(),
            nullable=False,
            comment="The city of the equipment location.",
        ),
        sa.Column(
            "postal_code",
            sa.String(),
            nullable=False,
            comment="The postcode of the equipment location.",
        ),
        sa.Column(
            "latitude",
            sa.Double(),
            nullable=False,
            comment="The latitude of the equipment location.",
        ),
        sa.Column(
            "longitude",
            sa.Double(),
            nullable=False,
            comment="The longitude of the equipment location.",
        ),
        sa.Column(
            "notes",
            sa.Text(),
            nullable=True,
            comment="Any additional notes related to the equipment.",
        ),
        sa.Column(
            "create_date",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
            comment="Date and time (UTC) when the physical record was created in the database.",
        ),
        sa.Column(
            "update_date",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
            comment="Date and time (UTC) when the physical record was updated in the database. It will be the same as the create_date until the record is first updated after creation.",
        ),
        sa.Column(
            "create_user",
            sa.String(),
            nullable=True,
            comment="The user who created this record in the database.",
        ),
        sa.Column(
            "update_user",
            sa.String(),
            nullable=True,
            comment="The user who last updated this record in the database.",
        ),
        sa.ForeignKeyConstraint(
            ["compliance_report_id"],
            ["compliance_report.compliance_report_id"],
        ),
        sa.ForeignKeyConstraint(
            ["fuel_measurement_type_id"],
            ["fuel_measurement_type.fuel_measurement_type_id"],
        ),
        sa.ForeignKeyConstraint(
            ["intended_use_id"],
            ["end_use_type.end_use_type_id"],
        ),
        sa.ForeignKeyConstraint(
            ["level_of_equipment_id"],
            ["level_of_equipment.level_of_equipment_id"],
        ),
        sa.PrimaryKeyConstraint("final_supply_equipment_id"),
        comment="Final Supply Equipment",
    )
    op.create_index(
        op.f("ix_final_supply_equipment_compliance_report_id"),
        "final_supply_equipment",
        ["compliance_report_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_final_supply_equipment_fuel_measurement_type_id"),
        "final_supply_equipment",
        ["fuel_measurement_type_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_final_supply_equipment_intended_use_id"),
        "final_supply_equipment",
        ["intended_use_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_final_supply_equipment_level_of_equipment_id"),
        "final_supply_equipment",
        ["level_of_equipment_id"],
        unique=False,
    )
    op.add_column(
        "end_use_type", sa.Column("intended_use", sa.Boolean(), nullable=False)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        op.f("ix_final_supply_equipment_level_of_equipment_id"),
        table_name="final_supply_equipment",
    )
    op.drop_index(
        op.f("ix_final_supply_equipment_intended_use_id"),
        table_name="final_supply_equipment",
    )
    op.drop_index(
        op.f("ix_final_supply_equipment_fuel_measurement_type_id"),
        table_name="final_supply_equipment",
    )
    op.drop_index(
        op.f("ix_final_supply_equipment_compliance_report_id"),
        table_name="final_supply_equipment",
    )
    op.drop_table("final_supply_equipment")
    op.drop_table("level_of_equipment")
    op.drop_table("fuel_measurement_type")
    # ### end Alembic commands ###
