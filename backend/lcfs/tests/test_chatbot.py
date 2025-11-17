import pytest
from fastapi import FastAPI, status
from httpx import AsyncClient

from lcfs.web.api.chatbot.views import get_chatbot_service


class FakeChatbotService:
    def __init__(self):
        self.documents = []

    def ingest_pdf(self, file_bytes: bytes, filename: str):
        document = {
            "document_id": f"doc-{len(self.documents) + 1}",
            "name": filename,
            "created_at": "2024-01-01T00:00:00",
            "chunk_count": 1,
        }
        self.documents.append(document)
        return document

    def list_documents(self):
        return list(self.documents)

    def answer_question(self, question: str, document_ids=None):
        return {
            "answer": f"answer for {question}",
            "sources": [
                {
                    "document_id": "doc-1",
                    "document_name": "sample.pdf",
                    "snippet": "sample snippet",
                    "score": 0.9,
                }
            ],
        }


@pytest.mark.anyio
async def test_upload_chatbot_document(
    fastapi_app: FastAPI, client: AsyncClient
) -> None:
    fake_service = FakeChatbotService()
    fastapi_app.dependency_overrides[get_chatbot_service] = lambda: fake_service

    url = fastapi_app.url_path_for("upload_chatbot_document")
    response = await client.post(
        url,
        files={"file": ("sample.pdf", b"(hello world)", "application/pdf")},
    )

    try:
        assert response.status_code == status.HTTP_201_CREATED
        payload = response.json()
        assert payload["document_id"] == "doc-1"
        assert payload["name"] == "sample.pdf"
    finally:
        fastapi_app.dependency_overrides.clear()


@pytest.mark.anyio
async def test_query_chatbot(fastapi_app: FastAPI, client: AsyncClient) -> None:
    fake_service = FakeChatbotService()
    fastapi_app.dependency_overrides[get_chatbot_service] = lambda: fake_service

    url = fastapi_app.url_path_for("query_chatbot")
    response = await client.post(url, json={"question": "What is LCFS?"})

    try:
        assert response.status_code == status.HTTP_200_OK
        payload = response.json()
        assert payload["answer"].startswith("answer for")
        assert payload["sources"][0]["document_id"] == "doc-1"
    finally:
        fastapi_app.dependency_overrides.clear()
