from __future__ import annotations

import re
import zlib
from pathlib import Path
from typing import Dict, List, Optional

from lcfs.services.chatbot.document_store import DocumentStore, normalize_text
from lcfs.settings import TEMP_DIR


_STREAM_RE = re.compile(rb"stream\r?\n(.*?)endstream", re.DOTALL)
_PAREN_TEXT_RE = re.compile(rb"\(([^()]*)\)")


def _is_readable(snippet: str) -> bool:
    """Heuristic to drop binary noise while keeping natural language."""

    if not snippet or len(snippet.strip()) < 8:
        return False

    alpha_ratio = sum(ch.isalpha() for ch in snippet) / max(len(snippet), 1)
    if alpha_ratio < 0.5:
        return False

    words = re.findall(r"[a-zA-Z]{3,}", snippet)
    if not words:
        return False

    vowel_words = sum(1 for word in words if re.search(r"[aeiou]", word, re.I))
    word_density = len(words) / max(len(snippet.split()), 1)
    return vowel_words > 0 and word_density >= 0.3


def _clean_snippets(snippets: List[str]) -> List[str]:
    cleaned: List[str] = []
    for raw in snippets:
        normalized = normalize_text(raw)
        if _is_readable(normalized):
            cleaned.append(normalized)
    return cleaned


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

    cleaned = _clean_snippets(snippets)
    return normalize_text(" ".join(cleaned))


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
