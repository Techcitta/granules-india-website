#!/usr/bin/env python3
"""Fast batch ingestion - text PDFs first, then OCR scanned ones. Uses Qdrant."""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

import fitz
from data.pdf_ingestion import ingest_pdf_file
from rag.ingest import ingest_pdf_chunks
from rag.vectorstore import get_client, COLLECTION_NAME

PDF_DIR = Path(__file__).resolve().parent.parent / "public" / "pdfs"


def get_ingested_filenames():
    """Get set of PDF filenames already in Qdrant."""
    client = get_client()
    try:
        info = client.get_collection(COLLECTION_NAME)
        if info.points_count == 0:
            return set()
        # Scroll through all points to find PDF filenames
        filenames = set()
        offset = None
        while True:
            result, offset = client.scroll(
                collection_name=COLLECTION_NAME,
                limit=1000,
                offset=offset,
                with_payload=["filename"],
            )
            for point in result:
                fn = point.payload.get("filename", "")
                if fn and fn.endswith(".pdf"):
                    filenames.add(fn)
            if offset is None:
                break
        return filenames
    except Exception:
        return set()


def has_text_content(pdf_path):
    """Check if PDF has extractable text (not scanned)."""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text = page.get_text("text")
            if text and len(text.strip()) > 100:
                doc.close()
                return True
        doc.close()
    except Exception:
        pass
    return False


def main():
    # Initialize Qdrant
    client = get_client()
    info = client.get_collection(COLLECTION_NAME)
    print(f"[FAST] Qdrant has {info.points_count or 0} points")

    ingested = get_ingested_filenames()
    print(f"[FAST] {len(ingested)} PDF files already in Qdrant")

    pdf_files = sorted(PDF_DIR.glob("*.pdf"))
    pending = [f for f in pdf_files if f.name not in ingested]
    print(f"[FAST] {len(pending)} files to process out of {len(pdf_files)} total")

    if not pending:
        print("[FAST] Nothing to do!")
        return

    # Separate text-based vs scanned PDFs
    text_pdfs = []
    scanned_pdfs = []
    for f in pending:
        if has_text_content(str(f)):
            text_pdfs.append(f)
        else:
            scanned_pdfs.append(f)

    print(f"[FAST] Text-based: {len(text_pdfs)} | Scanned (OCR needed): {len(scanned_pdfs)}")

    success = 0
    failed = 0
    total_chunks = 0
    start = time.time()

    print(f"\n=== PHASE 1: Text-based PDFs ({len(text_pdfs)}) ===")
    for i, pdf_file in enumerate(text_pdfs, 1):
        try:
            chunks = ingest_pdf_file(str(pdf_file))
            if chunks:
                ingest_pdf_chunks(chunks)
                total_chunks += len(chunks)
            success += 1
            elapsed = time.time() - start
            rate = success / (elapsed / 60) if elapsed > 0 else 0
            print(f"[{i}/{len(text_pdfs)}] OK: {pdf_file.name} ({len(chunks)} chunks) [{rate:.0f}/min]")
        except Exception as e:
            failed += 1
            print(f"[{i}/{len(text_pdfs)}] FAIL: {pdf_file.name} - {e}")

    print(f"\n=== PHASE 2: Scanned PDFs with OCR ({len(scanned_pdfs)}) ===")
    for i, pdf_file in enumerate(scanned_pdfs, 1):
        try:
            chunks = ingest_pdf_file(str(pdf_file))
            if chunks:
                ingest_pdf_chunks(chunks)
                total_chunks += len(chunks)
            success += 1
            print(f"[{i}/{len(scanned_pdfs)}] OK: {pdf_file.name} ({len(chunks)} chunks)")
        except Exception as e:
            failed += 1
            print(f"[{i}/{len(scanned_pdfs)}] FAIL: {pdf_file.name} - {e}")

    elapsed = time.time() - start
    info = client.get_collection(COLLECTION_NAME)
    print(f"\n[DONE] Processed {success} files ({failed} failed)")
    print(f"[DONE] Added {total_chunks} chunks in {elapsed/60:.1f} minutes")
    print(f"[DONE] Total vectors in Qdrant: {info.points_count}")


if __name__ == "__main__":
    main()
