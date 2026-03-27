from io import BytesIO
from pypdf import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(file_bytes))
        pages_text = []

        for page in reader.pages:
            text = page.extract_text() or ""
            pages_text.append(text.strip())

        return "\n\n".join([p for p in pages_text if p]).strip()
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")