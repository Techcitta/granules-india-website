import os
import re
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
from rag.ingest import ingest_pdf_chunks


PDF_DIR = Path(__file__).resolve().parent.parent.parent / "public" / "pdfs"


def _categorize_pdf(filename: str) -> tuple[str, str]:
    """Return (route, section) based on filename prefix."""
    name = filename.lower()
    if name.startswith("quarterly-"):
        return ("#investors/quarterly-results", "quarterly-result")
    elif name.startswith("investor-presentation"):
        return ("#investors/investor-presentation", "investor-presentation")
    elif name.startswith("subsidiary-"):
        return ("#investors/subsidiary-accounts", "subsidiary-account")
    else:
        return ("#investors/annual-reports", "annual-report")


def _chunk_text(text: str, filename: str, page_number: int, title: str, file_path: str) -> list[dict]:
    chunks = []
    route, section = _categorize_pdf(filename)
    sentences = re.split(r'(?<=[.!?])\s+', text)
    current_chunk = ""
    chunk_index = 0

    for sentence in sentences:
        test = f"{current_chunk} {sentence}" if current_chunk else sentence
        if len(test) > 800 and current_chunk:
            chunks.append({
                "id": f"pdf_{filename}_p{page_number}_{chunk_index}",
                "title": title,
                "route": route,
                "section": section,
                "source_type": "pdf",
                "filename": filename,
                "file_path": file_path,
                "page_number": page_number,
                "content": current_chunk.strip(),
            })
            chunk_index += 1
            current_chunk = sentence
        else:
            current_chunk = test

    if current_chunk.strip():
        chunks.append({
            "id": f"pdf_{filename}_p{page_number}_{chunk_index}",
            "title": title,
            "route": route,
            "section": section,
            "source_type": "pdf",
            "filename": filename,
            "file_path": file_path,
            "page_number": page_number,
            "content": current_chunk.strip(),
        })

    return chunks


def _ocr_page(page, dpi=200) -> str:
    """OCR a single page by rendering to image and running tesseract."""
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    text = pytesseract.image_to_string(img, lang="eng")
    return text


def ingest_pdf_file(file_path: str) -> list[dict]:
    filename = os.path.basename(file_path)
    title = filename.replace(".pdf", "").replace("-", " ").replace("_", " ")
    file_path_rel = os.path.relpath(file_path, str(PDF_DIR.parent))

    doc = fitz.open(file_path)
    all_chunks = []

    for i, page in enumerate(doc):
        # Try direct text extraction first
        page_text = page.get_text("text")

        # If no text or very little text, use OCR
        if not page_text or len(page_text.strip()) < 50:
            try:
                page_text = _ocr_page(page)
            except Exception:
                continue

        if page_text and len(page_text.strip()) > 50:
            chunks = _chunk_text(page_text.strip(), filename, i + 1, title, file_path_rel)
            all_chunks.extend(chunks)

    doc.close()
    return all_chunks


def ingest_all_pdfs():
    if not PDF_DIR.exists():
        print(f"[PDF] No pdfs directory found at {PDF_DIR}")
        return

    pdf_files = sorted(PDF_DIR.glob("*.pdf"))
    if not pdf_files:
        print(f"[PDF] No PDF files found in {PDF_DIR}")
        return

    print(f"[PDF] Found {len(pdf_files)} PDF files")

    for pdf_file in pdf_files:
        print(f"[PDF] Processing {pdf_file.name}...")
        chunks = ingest_pdf_file(str(pdf_file))
        if chunks:
            ingest_pdf_chunks(chunks)
            print(f"[PDF] {pdf_file.name}: {len(chunks)} chunks ingested")
        else:
            print(f"[PDF] {pdf_file.name}: 0 chunks (skipped)")

    print("[PDF] All PDFs processed")


if __name__ == "__main__":
    ingest_all_pdfs()
