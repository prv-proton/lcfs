from math import ceil
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from starlette.responses import StreamingResponse

from lcfs.web.api.base import PaginationRequestSchema
from lcfs.web.api.credit_ledger.schema import CreditLedgerTxnSchema
from lcfs.web.api.credit_ledger.services import CreditLedgerService


@pytest.fixture
def mock_repo():
    repo = MagicMock()
    repo.get_rows_paginated = AsyncMock(return_value=([], 0))
    return repo


@pytest.fixture
def credit_ledger_service(mock_repo):
    return CreditLedgerService(repo=mock_repo)


@pytest.mark.anyio
async def test_get_ledger_paginated_success(credit_ledger_service, mock_repo):
    pagination_request = PaginationRequestSchema(
        page=2, size=5, filters=[], sort_orders=[]
    )

    mock_rows = [
        SimpleNamespace(
            transaction_type="Credit",
            compliance_period="2023",
            organization_id=1,
            compliance_units=10,
            available_balance=10,
            update_date="2024-01-01",
        )
        for _ in range(3)
    ]
    mock_repo.get_rows_paginated.return_value = (mock_rows, 12)

    data = await credit_ledger_service.get_ledger_paginated(
        organization_id=1, pagination=pagination_request
    )

    assert data.pagination.total == 12
    assert data.pagination.total_pages == ceil(12 / 5)
    assert len(data.ledger) == 3
    assert isinstance(data.ledger[0], CreditLedgerTxnSchema)


@pytest.mark.anyio
async def test_export_transactions_generates_stream(credit_ledger_service, mock_repo):
    with patch(
        "lcfs.web.api.credit_ledger.services.SpreadsheetBuilder.build_spreadsheet",
        return_value=b"dummy-bytes",
    ):
        mock_repo.get_rows_paginated.return_value = ([], 0)

        resp = await credit_ledger_service.export_transactions(
            organization_id=1, compliance_year=None, export_format="csv"
        )

        assert isinstance(resp, StreamingResponse)
        assert resp.media_type == "text/csv"
        assert resp.headers["Content-Disposition"].startswith("attachment;")
