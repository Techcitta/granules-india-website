#!/usr/bin/env python3
"""Smart PDF ingestion - skips already-ingested files. Uses Qdrant."""

import os
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

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


def main():
    client = get_client()
    info = client.get_collection(COLLECTION_NAME)
    print(f"[BATCH] Qdrant has {info.points_count or 0} points")

    ingested = get_ingested_filenames()
    print(f"[BATCH] {len(ingested)} PDF files already in Qdrant")

    pdf_files = sorted(PDF_DIR.glob("*.pdf"))
    pending = [f for f in pdf_files if f.name not in ingested]
    print(f"[BATCH] {len(pending)} files to process out of {len(pdf_files)} total")

    if not pending:
        print("[BATCH] Nothing to do!")
        return

    success = 0
    failed = 0
    total_chunks = 0
    start = time.time()

    for i, pdf_file in enumerate(pending, 1):
        try:
            chunks = ingest_pdf_file(str(pdf_file))
            if chunks:
                ingest_pdf_chunks(chunks)
                total_chunks += len(chunks)
            success += 1
            elapsed = time.time() - start
            rate = success / (elapsed / 60) if elapsed > 0 else 0
            print(f"[{i}/{len(pending)}] OK: {pdf_file.name} ({len(chunks)} chunks) [{rate:.1f} files/min]")
        except Exception as e:
            failed += 1
            print(f"[{i}/{len(pending)}] FAIL: {pdf_file.name} - {e}")

    elapsed = time.time() - start
    info = client.get_collection(COLLECTION_NAME)
    print(f"\n[DONE] Processed {success} files ({failed} failed)")
    print(f"[DONE] Added {total_chunks} chunks in {elapsed/60:.1f} minutes")
    print(f"[DONE] Total vectors in Qdrant: {info.points_count}")


if __name__ == "__main__":
    main()
