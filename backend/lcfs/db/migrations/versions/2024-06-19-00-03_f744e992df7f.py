"""Fuel code last updated type change from date to datetime

Revision ID: f744e992df7f
Revises: cf8370eb1378
Create Date: 2024-06-19 00:03:06.264649

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "f744e992df7f"
down_revision = "cf8370eb1378"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###

    op.alter_column(
        "fuel_code",
        "last_updated",
        existing_type=sa.DATE(),
        type_=sa.DateTime(timezone=True),
        existing_comment="Date at which the record was last updated.",
        existing_nullable=False,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "fuel_code",
        "last_updated",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DATE(),
        existing_comment="Date at which the record was last updated.",
        existing_nullable=False,
    )
    # ### end Alembic commands ###
