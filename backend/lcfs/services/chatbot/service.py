from __future__ import annotations

import re
import zlib
from pathlib import Path
from typing import Dict, List, Optional

from lcfs.services.chatbot.document_store import DocumentStore, normalize_text
from lcfs.settings import TEMP_DIR


_STREAM_RE = re.compile(rb"stream\r?\n(.*?)endstream", re.DOTALL)
_PAREN_TEXT_RE = re.compile(rb"\(([^()]*)\)")


def _extract_stream_text(file_bytes: bytes) -> str:
    """Return readable text from compressed or plain PDF streams."""

    snippets: List[str] = []
    for match in _STREAM_RE.finditer(file_bytes):
        stream_content = match.group(1)
        try:
            stream_content = zlib.decompress(stream_content)
        except Exception:
            # Not every stream is compressed; best-effort fallback keeps plaintext.
            pass

        for candidate in _PAREN_TEXT_RE.findall(stream_content):
            snippets.append(candidate.decode("utf-8", errors="ignore"))

    return normalize_text(" ".join(snippets))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    stream_text = _extract_stream_text(file_bytes)
    if stream_text:
        return stream_text

    decoded = file_bytes.decode("latin-1", errors="ignore")
    text_candidates = re.findall(r"\(([^)]+)\)", decoded)
    if text_candidates:
        return normalize_text(" ".join(text_candidates))

    return normalize_text(decoded)


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
