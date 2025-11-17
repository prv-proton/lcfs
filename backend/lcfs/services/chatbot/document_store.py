from __future__ import annotations

import json
import re
import uuid
from collections import Counter
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional

from lcfs.settings import TEMP_DIR


def _tokenize(text: str) -> List[str]:
    normalized = re.sub(r"\s+", " ", text.lower()).strip()
    return re.findall(r"[a-z0-9']+", normalized)


def _chunk_text(text: str, max_chars: int = 900) -> List[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks: List[str] = []
    current: List[str] = []
    length = 0

    for sentence in sentences:
        if not sentence:
            continue
        sentence_length = len(sentence)
        if length + sentence_length > max_chars and current:
            chunks.append(" ".join(current).strip())
            current = [sentence]
            length = sentence_length
        else:
            current.append(sentence)
            length += sentence_length

    if current:
        chunks.append(" ".join(current).strip())

    if not chunks:
        return [text.strip()]
    return chunks


def _humanize_answer(best_match: Dict[str, object], matches: List[Dict[str, object]]) -> str:
    snippet = str(best_match.get("snippet", "")).strip()
    document_names = [match.get("document_name", "") for match in matches[:3] if match.get("document_name")]

    if document_names:
        unique_names = list(dict.fromkeys(document_names))
        if len(unique_names) == 1:
            sources_phrase = unique_names[0]
        elif len(unique_names) == 2:
            sources_phrase = " and ".join(unique_names)
        else:
            sources_phrase = ", ".join(unique_names[:-1]) + f", and {unique_names[-1]}"
        prefix = f"Based on {sources_phrase}, here's what your documents say: "
    else:
        prefix = "Here's what your documents say: "

    if not snippet:
        return prefix.rstrip()

    return f"{prefix}{snippet}"


@dataclass
class StoredDocument:
    document_id: str
    name: str
    created_at: datetime
    chunks: List[str]

    @property
    def chunk_count(self) -> int:
        return len(self.chunks)

    def to_dict(self) -> Dict[str, str]:
        return {
            "document_id": self.document_id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "chunks": self.chunks,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, str]) -> "StoredDocument":
        created_at = datetime.fromisoformat(data["created_at"])
        return cls(
            document_id=data["document_id"],
            name=data["name"],
            created_at=created_at,
            chunks=data.get("chunks", []),
        )


class DocumentStore:
    def __init__(self, storage_path: Optional[Path] = None):
        self.storage_path = storage_path or TEMP_DIR / "lcfs_chatbot_documents.json"
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self._documents: List[StoredDocument] = self._load()

    def _load(self) -> List[StoredDocument]:
        if not self.storage_path.exists():
            return []
        try:
            raw = json.loads(self.storage_path.read_text())
            docs = []
            for entry in raw.get("documents", []):
                try:
                    docs.append(StoredDocument.from_dict(entry))
                except (KeyError, ValueError):
                    continue
            return docs
        except json.JSONDecodeError:
            return []

    def _save(self) -> None:
        payload = {"documents": [doc.to_dict() for doc in self._documents]}
        self.storage_path.write_text(json.dumps(payload, indent=2))

    def add_document(self, name: str, text: str) -> StoredDocument:
        document = StoredDocument(
            document_id=str(uuid.uuid4()),
            name=name,
            created_at=datetime.utcnow(),
            chunks=_chunk_text(text),
        )
        self._documents.append(document)
        self._save()
        return document

    def list_documents(self) -> List[StoredDocument]:
        return list(self._documents)

    def _iter_chunks(
        self, document_ids: Optional[Iterable[str]] = None
    ) -> Iterable[Dict[str, str]]:
        allowed_ids = set(document_ids) if document_ids else None
        for document in self._documents:
            if allowed_ids is not None and document.document_id not in allowed_ids:
                continue
            for chunk in document.chunks:
                yield {
                    "text": chunk,
                    "document_id": document.document_id,
                    "document_name": document.name,
                    "created_at": document.created_at,
                }

    def find_relevant_chunks(
        self, question: str, document_ids: Optional[List[str]] = None
    ) -> List[Dict[str, object]]:
        tokens = _tokenize(question)
        if not tokens:
            return []

        question_counter = Counter(tokens)
        results: List[Dict[str, object]] = []

        for chunk in self._iter_chunks(document_ids):
            chunk_tokens = _tokenize(chunk["text"])
            if not chunk_tokens:
                continue
            chunk_counter = Counter(chunk_tokens)
            score = sum(
                question_counter[token] * chunk_counter.get(token, 0)
                for token in question_counter
            )
            normalized_score = score / max(sum(chunk_counter.values()), 1)
            if normalized_score == 0:
                continue
            results.append({
                "score": normalized_score,
                "snippet": chunk["text"],
                "document_id": chunk["document_id"],
                "document_name": chunk["document_name"],
            })

        results.sort(key=lambda item: item["score"], reverse=True)
        return results

    def answer_question(
        self, question: str, document_ids: Optional[List[str]] = None
    ) -> Dict[str, object]:
        matches = self.find_relevant_chunks(question, document_ids)
        if not matches:
            return {
                "answer": (
                    "I couldn't find an exact match in your documents. "
                    "Try rephrasing the question or uploading a document with the relevant details."
                ),
                "sources": [],
            }

        best_answer = _humanize_answer(matches[0], matches)
        sources = [
            {
                "document_id": match["document_id"],
                "document_name": match["document_name"],
                "snippet": match["snippet"][:400],
                "score": round(match["score"], 3),
            }
            for match in matches[:3]
        ]

        return {"answer": best_answer, "sources": sources}
