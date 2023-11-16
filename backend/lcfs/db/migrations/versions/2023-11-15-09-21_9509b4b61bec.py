"""empty message

Revision ID: 9509b4b61bec
Revises: 82b674748885
Create Date: 2023-11-15 09:21:32.342094

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "9509b4b61bec"
down_revision = "82b674748885"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "notification_channel",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            "channel_name",
            sa.Enum("EMAIL", "IN_APP", name="channel_enum"),
            nullable=False,
        ),
        sa.Column("enabled", sa.Boolean(), nullable=True),
        sa.Column("subscribe_by_default", sa.Boolean(), nullable=True),
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
        sa.PrimaryKeyConstraint("id"),
        comment="Tracks the state and defaults for communication channels",
    )
    op.create_table(
        "notification_type",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            "name",
            sa.Enum(
                "CREDIT_TRANSFER_CREATED",
                "CREDIT_TRANSFER_SIGNED_1OF2",
                "CREDIT_TRANSFER_SIGNED_2OF2",
                "CREDIT_TRANSFER_PROPOSAL_REFUSED",
                "CREDIT_TRANSFER_PROPOSAL_ACCEPTED",
                "CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL",
                "CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION",
                "CREDIT_TRANSFER_DECLINED",
                "CREDIT_TRANSFER_APPROVED",
                "CREDIT_TRANSFER_RESCINDED",
                "CREDIT_TRANSFER_COMMENT",
                "CREDIT_TRANSFER_INTERNAL_COMMENT",
                "PVR_CREATED",
                "PVR_RECOMMENDED_FOR_APPROVAL",
                "PVR_RESCINDED",
                "PVR_PULLED_BACK",
                "PVR_DECLINED",
                "PVR_APPROVED",
                "PVR_COMMENT",
                "PVR_INTERNAL_COMMENT",
                "PVR_RETURNED_TO_ANALYST",
                "DOCUMENT_PENDING_SUBMISSION",
                "DOCUMENT_SUBMITTED",
                "DOCUMENT_SCAN_FAILED",
                "DOCUMENT_RECEIVED",
                "DOCUMENT_ARCHIVED",
                "COMPLIANCE_REPORT_DRAFT",
                "COMPLIANCE_REPORT_SUBMITTED",
                "COMPLIANCE_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST",
                "COMPLIANCE_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST",
                "COMPLIANCE_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER",
                "COMPLIANCE_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER",
                "COMPLIANCE_REPORT_ACCEPTED",
                "COMPLIANCE_REPORT_REJECTED",
                "COMPLIANCE_REPORT_REQUESTED_SUPPLEMENTAL",
                "EXCLUSION_REPORT_DRAFT",
                "EXCLUSION_REPORT_SUBMITTED",
                "EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_ANALYST",
                "EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_ANALYST",
                "EXCLUSION_REPORT_RECOMMENDED_FOR_ACCEPTANCE_MANAGER",
                "EXCLUSION_REPORT_RECOMMENDED_FOR_REJECTION_MANAGER",
                "EXCLUSION_REPORT_ACCEPTED",
                "EXCLUSION_REPORT_REJECTED",
                "EXCLUSION_REPORT_REQUESTED_SUPPLEMENTAL",
                name="notification_type_enum",
            ),
            nullable=False,
        ),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("email_content", sa.Text(), nullable=True),
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
        sa.PrimaryKeyConstraint("id"),
        comment="Represents a Notification type",
    )
    op.create_table(
        "organization_attorney_address",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "name",
            sa.String(length=500),
            nullable=True,
            comment="Attorney's Organization name",
        ),
        sa.Column("street_address", sa.String(length=500), nullable=True),
        sa.Column("address_other", sa.String(length=100), nullable=True),
        sa.Column("city", sa.String(length=100), nullable=True),
        sa.Column("province_state", sa.String(length=50), nullable=True),
        sa.Column("country", sa.String(length=100), nullable=True),
        sa.Column("postalCode_zipCode", sa.String(length=10), nullable=True),
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
            "effective_date",
            sa.Date(),
            nullable=True,
            comment="The calendar date the value became valid.",
        ),
        sa.Column(
            "expiration_date",
            sa.Date(),
            nullable=True,
            comment="The calendar date the value is no longer valid.",
        ),
        sa.PrimaryKeyConstraint("id"),
        comment="Represents an organization attorney's address.",
    )
    op.create_table(
        "organization_status",
        sa.Column(
            "id",
            sa.Integer(),
            autoincrement=True,
            nullable=False,
            comment="Unique identifier for the organization",
        ),
        sa.Column(
            "status",
            sa.Enum(
                "Unregistered",
                "Registered",
                "Suspended",
                "Canceled",
                name="org_status_enum",
            ),
            nullable=True,
            comment="Organization's status",
        ),
        sa.Column(
            "description",
            sa.String(length=500),
            nullable=True,
            comment="Organization description",
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
        sa.PrimaryKeyConstraint("id"),
        comment="Contains list of organization type",
    )
    op.create_table(
        "organization_type",
        sa.Column(
            "type",
            sa.Enum(
                "fuel_supplier",
                "electricity_supplier",
                "broker",
                "utilities",
                name="org_type_enum",
            ),
            nullable=True,
            comment="Organization's Types",
        ),
        sa.Column(
            "description",
            sa.String(length=500),
            nullable=True,
            comment="Organization Types",
        ),
        sa.Column("id", sa.Integer(), nullable=False),
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
        sa.PrimaryKeyConstraint("id"),
        comment="Represents a Organization types",
    )
    op.create_table(
        "notification_channel_subscription",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("is_enabled", sa.Boolean(), nullable=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("channel_id", sa.Integer(), nullable=True),
        sa.Column("notification_type_id", sa.Integer(), nullable=True),
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
            ["channel_id"],
            ["notification_channel.id"],
        ),
        sa.ForeignKeyConstraint(
            ["notification_type_id"],
            ["notification_type.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        comment="Represents a user's subscription to notification events",
    )
    op.create_table(
        "notification_message",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=True),
        sa.Column("is_warning", sa.Boolean(), nullable=True),
        sa.Column("is_error", sa.Boolean(), nullable=True),
        sa.Column("is_archived", sa.Boolean(), nullable=True),
        sa.Column("origin_user_id", sa.Integer(), nullable=True),
        sa.Column("related_organization_id", sa.Integer(), nullable=True),
        sa.Column("related_user_id", sa.Integer(), nullable=True),
        sa.Column("notification_type_id", sa.Integer(), nullable=True),
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
            ["notification_type_id"],
            ["notification_type.id"],
        ),
        sa.ForeignKeyConstraint(
            ["origin_user_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["related_organization_id"],
            ["organization.id"],
        ),
        sa.ForeignKeyConstraint(
            ["related_user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        comment="Represents a notification message sent to an application user",
    )
    op.drop_table("organization_balance")
    op.drop_table("organization_history")
    op.add_column("organization", sa.Column("address", sa.Integer(), nullable=True))
    op.add_column(
        "organization", sa.Column("attorney_address", sa.Integer(), nullable=True)
    )
    op.add_column(
        "organization",
        sa.Column(
            "effective_date",
            sa.Date(),
            nullable=True,
            comment="The calendar date the value became valid.",
        ),
    )
    op.add_column(
        "organization",
        sa.Column(
            "expiration_date",
            sa.Date(),
            nullable=True,
            comment="The calendar date the value is no longer valid.",
        ),
    )
    op.alter_column(
        "organization",
        "status",
        existing_type=postgresql.ENUM("Active", "Archived", name="status_enum"),
        type_=sa.Integer(),
        comment=None,
        existing_comment="Organization's status",
        existing_nullable=True,
    )
    op.alter_column(
        "organization",
        "type",
        existing_type=postgresql.ENUM(
            "Government", "Part3FuelSupplier", name="organization_type_enum"
        ),
        type_=sa.Integer(),
        nullable=True,
        existing_comment="Organization's type",
    )
    op.create_foreign_key(None, "organization", "organization_type", ["type"], ["id"])
    op.create_foreign_key(
        None, "organization", "organization_status", ["status"], ["id"]
    )
    op.create_foreign_key(
        None,
        "organization",
        "organization_attorney_address",
        ["attorney_address"],
        ["id"],
    )
    op.create_foreign_key(
        None, "organization", "organization_address", ["address"], ["id"]
    )
    op.drop_column("organization", "actions_type")
    op.add_column(
        "organization_address",
        sa.Column(
            "name", sa.String(length=500), nullable=True, comment="Organization name"
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column("street_address", sa.String(length=500), nullable=True),
    )
    op.add_column(
        "organization_address",
        sa.Column("address_other", sa.String(length=100), nullable=True),
    )
    op.add_column(
        "organization_address",
        sa.Column("province_state", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "organization_address",
        sa.Column("postalCode_zipCode", sa.String(length=10), nullable=True),
    )
    op.alter_column(
        "organization_address",
        "effective_date",
        existing_type=postgresql.TIMESTAMP(),
        type_=sa.Date(),
        existing_comment="The calendar date the value became valid.",
        existing_nullable=True,
    )
    op.drop_constraint(
        "organization_address_organization_id_fkey",
        "organization_address",
        type_="foreignkey",
    )
    op.drop_column("organization_address", "postal_code")
    op.drop_column("organization_address", "address_line_2")
    op.drop_column("organization_address", "attorney_postal_code")
    op.drop_column("organization_address", "attorney_representative_name")
    op.drop_column("organization_address", "other")
    op.drop_column("organization_address", "state")
    op.drop_column("organization_address", "address_line_1")
    op.drop_column("organization_address", "attorney_province")
    op.drop_column("organization_address", "attorney_street_address")
    op.drop_column("organization_address", "attorney_address_other")
    op.drop_column("organization_address", "organization_id")
    op.drop_column("organization_address", "attorney_city")
    op.drop_column("organization_address", "attorney_country")
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_country",
            sa.VARCHAR(length=100),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_city", sa.VARCHAR(length=100), autoincrement=False, nullable=True
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column("organization_id", sa.INTEGER(), autoincrement=False, nullable=True),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_address_other",
            sa.VARCHAR(length=100),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_street_address",
            sa.VARCHAR(length=500),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_province",
            sa.VARCHAR(length=50),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "address_line_1", sa.VARCHAR(length=500), autoincrement=False, nullable=True
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column("state", sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    )
    op.add_column(
        "organization_address",
        sa.Column("other", sa.VARCHAR(length=100), autoincrement=False, nullable=True),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_representative_name",
            sa.VARCHAR(length=500),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "attorney_postal_code",
            sa.VARCHAR(length=10),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "address_line_2", sa.VARCHAR(length=100), autoincrement=False, nullable=True
        ),
    )
    op.add_column(
        "organization_address",
        sa.Column(
            "postal_code", sa.VARCHAR(length=10), autoincrement=False, nullable=True
        ),
    )
    op.create_foreign_key(
        "organization_address_organization_id_fkey",
        "organization_address",
        "organization",
        ["organization_id"],
        ["id"],
    )
    op.alter_column(
        "organization_address",
        "effective_date",
        existing_type=sa.Date(),
        type_=postgresql.TIMESTAMP(),
        existing_comment="The calendar date the value became valid.",
        existing_nullable=True,
    )
    op.drop_column("organization_address", "postalCode_zipCode")
    op.drop_column("organization_address", "province_state")
    op.drop_column("organization_address", "address_other")
    op.drop_column("organization_address", "street_address")
    op.drop_column("organization_address", "name")
    op.add_column(
        "organization",
        sa.Column(
            "actions_type",
            postgresql.ENUM(
                "Buy And Sell", "Sell Only", "None", name="actions_type_enum"
            ),
            autoincrement=False,
            nullable=True,
            comment="Organization's actions type",
        ),
    )
    op.drop_constraint(None, "organization", type_="foreignkey")
    op.drop_constraint(None, "organization", type_="foreignkey")
    op.drop_constraint(None, "organization", type_="foreignkey")
    op.drop_constraint(None, "organization", type_="foreignkey")
    op.alter_column(
        "organization",
        "type",
        existing_type=sa.Integer(),
        type_=postgresql.ENUM(
            "Government", "Part3FuelSupplier", name="organization_type_enum"
        ),
        nullable=False,
        existing_comment="Organization's type",
    )
    op.alter_column(
        "organization",
        "status",
        existing_type=sa.Integer(),
        type_=postgresql.ENUM("Active", "Archived", name="status_enum"),
        comment="Organization's status",
        existing_nullable=True,
    )
    op.drop_column("organization", "expiration_date")
    op.drop_column("organization", "effective_date")
    op.drop_column("organization", "attorney_address")
    op.drop_column("organization", "address")
    op.create_table(
        "organization_history",
        sa.Column("organization_id", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column(
            "history_text",
            sa.VARCHAR(length=1000),
            autoincrement=False,
            nullable=True,
            comment="Details for this history entry",
        ),
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column(
            "create_date",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=True,
            comment="Date and time (UTC) when the physical record was created in the database.",
        ),
        sa.Column(
            "update_date",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=True,
            comment="Date and time (UTC) when the physical record was updated in the database. It will be the same as the create_date until the record is first updated after creation.",
        ),
        sa.Column(
            "create_user",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
            comment="The user who created this record in the database.",
        ),
        sa.Column(
            "update_user",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
            comment="The user who last updated this record in the database.",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organization.id"],
            name="organization_history_organization_id_fkey",
        ),
        sa.PrimaryKeyConstraint("id", name="organization_history_pkey"),
        comment="History of changes to an organization",
    )
    op.create_table(
        "organization_balance",
        sa.Column("organization_id", sa.INTEGER(), autoincrement=False, nullable=False),
        sa.Column(
            "validated_credits",
            sa.BIGINT(),
            autoincrement=False,
            nullable=True,
            comment="The actual balance of validated Low Carbon Fuel credits held by a fuel supplier between the effective_date and the expiration_date. If expiration_date is NULL then we assume that it is the current balance.",
        ),
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column(
            "create_date",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=True,
            comment="Date and time (UTC) when the physical record was created in the database.",
        ),
        sa.Column(
            "update_date",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=True,
            comment="Date and time (UTC) when the physical record was updated in the database. It will be the same as the create_date until the record is first updated after creation.",
        ),
        sa.Column(
            "create_user",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
            comment="The user who created this record in the database.",
        ),
        sa.Column(
            "update_user",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
            comment="The user who last updated this record in the database.",
        ),
        sa.Column(
            "effective_date",
            postgresql.TIMESTAMP(),
            autoincrement=False,
            nullable=True,
            comment="The calendar date the value became valid.",
        ),
        sa.Column(
            "expiration_date",
            sa.DATE(),
            autoincrement=False,
            nullable=True,
            comment="The calendar date the value is no longer valid.",
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organization.id"],
            name="organization_balance_organization_id_fkey",
        ),
        sa.PrimaryKeyConstraint("id", name="organization_balance_pkey"),
        comment="Represents a fuel supplier organization's credit balance at a given point in time. The government organization does not have an actual credit balance, but rather one was set artificially high to enable the awarding or validating of credits to fuel suppliers within LCFS.",
    )
    op.drop_table("notification_message")
    op.drop_table("notification_channel_subscription")
    op.drop_table("organization_type")
    op.drop_table("organization_status")
    op.drop_table("organization_attorney_address")
    op.drop_table("notification_type")
    op.drop_table("notification_channel")
    # ### end Alembic commands ###