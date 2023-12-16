"""add required columns to organization

Revision ID: 4934fc1b9f97
Revises: 9d24914c3013
Create Date: 2023-12-12 21:14:19.451303

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "4934fc1b9f97"
down_revision = "9d24914c3013"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###

    # TODO: Revisit column ordering in PostgreSQL.
    # Currently, no 'AFTER' clause support in ALTER TABLE. Address in future migrations if needed.

    op.add_column(
        "organization",
        sa.Column("email", sa.VARCHAR(length=255), nullable=True)
    )
    op.add_column(
        "organization",
        sa.Column("phone", sa.VARCHAR(length=50), nullable=True)
    )
    op.add_column(
        "organization",
        sa.Column("edrms_record", sa.VARCHAR(length=100), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("organization", "email")
    op.drop_column("organization", "phone")
    op.drop_column("organization", "edrms_record")
    # ### end Alembic commands ###
