from pathlib import Path

from lcfs.services.chatbot.document_store import DocumentStore


def test_answer_question_returns_human_friendly_message(tmp_path: Path) -> None:
    storage_path = tmp_path / "docs.json"
    store = DocumentStore(storage_path=storage_path)
    store._documents = []
    store.add_document(
        name="guide.pdf",
        text=(
            "Low Carbon Fuel Standard program guidance. Applicants submit quarterly "
            "reports. Credits are issued after verification. \x00\x01\x02"
        ),
    )

    result = store.answer_question("How are credits issued?", document_ids=None)

    assert "here's what your documents say" in result["answer"].lower()
    assert "guide.pdf" in result["answer"].lower()
    assert result["sources"][0]["document_name"] == "guide.pdf"
    assert "\x00" not in result["answer"]
