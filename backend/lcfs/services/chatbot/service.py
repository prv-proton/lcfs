from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, List, Optional

from lcfs.services.chatbot.document_store import DocumentStore
from lcfs.settings import TEMP_DIR


def extract_text_from_pdf(file_bytes: bytes) -> str:
    decoded = file_bytes.decode("latin-1", errors="ignore")
    text_candidates = re.findall(r"\(([^)]+)\)", decoded)
    if text_candidates:
        return " ".join(text_candidates)
    return re.sub(r"[^\w\s.,:;\-]", " ", decoded)


class ChatbotService:
    def __init__(self, storage_path: Optional[Path] = None):
        self.store = DocumentStore(storage_path or TEMP_DIR / "lcfs_chatbot_documents.json")

    def ingest_pdf(self, file_bytes: bytes, filename: str) -> Dict[str, object]:
        text = extract_text_from_pdf(file_bytes)
        if not text.strip():
            raise ValueError("No readable text found in the uploaded document.")

        document = self.store.add_document(filename, text)
        return {
            "document_id": document.document_id,
            "name": document.name,
            "created_at": document.created_at,
            "chunk_count": document.chunk_count,
        }

    def list_documents(self) -> List[Dict[str, object]]:
        documents = []
        for document in self.store.list_documents():
            documents.append(
                {
                    "document_id": document.document_id,
                    "name": document.name,
                    "created_at": document.created_at,
                    "chunk_count": document.chunk_count,
                }
            )
        return documents

    def answer_question(
        self, question: str, document_ids: Optional[List[str]] = None
    ) -> Dict[str, object]:
        return self.store.answer_question(question, document_ids)
