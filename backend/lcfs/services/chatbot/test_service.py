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


def test_extract_text_skips_unreadable_streams() -> None:
    unreadable_stream = zlib.compress(b"\x00\xff\x10\x11\x12\x13random bytes without words")
    readable_stream = b"BT /F1 12 Tf (Clear guidance text) Tj ET"
    pdf_bytes = (
        b"%PDF-1.4\n1 0 obj<<>>\nstream\n"
        + unreadable_stream
        + b"\nendstream\n2 0 obj<<>>\nstream\n"
        + readable_stream
        + b"\nendstream\n%%EOF"
    )

    extracted = extract_text_from_pdf(pdf_bytes)

    assert "Clear guidance text" in extracted
    assert "random bytes" not in extracted
