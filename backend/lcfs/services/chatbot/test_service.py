import zlib

from lcfs.services.chatbot.service import extract_text_from_pdf


def test_extract_text_from_compressed_stream() -> None:
    stream_text = b"BT /F1 12 Tf (Program guidance) Tj ET"
    compressed_stream = zlib.compress(stream_text)
    pdf_bytes = b"%PDF-1.4\n1 0 obj<<>>\nstream\n" + compressed_stream + b"\nendstream\n%%EOF"

    extracted = extract_text_from_pdf(pdf_bytes)

    assert "Program guidance" in extracted
    assert "BT" not in extracted


def test_extract_text_strips_binary_noise() -> None:
    noisy_pdf = b"%PDF-1.4\x00\xff(stream)\nBT (Readable text) Tj ET endstream"

    extracted = extract_text_from_pdf(noisy_pdf)

    assert "Readable text" in extracted
    assert "\x00" not in extracted
