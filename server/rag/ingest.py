from dotenv import load_dotenv
load_dotenv()

from data.website_content import WEBSITE_CONTENT
from rag.embeddings import generate_embeddings
from rag.vectorstore import add_documents, get_collection_stats


def _chunk_content(items: list[dict]) -> list[dict]:
    chunks = []
    for item in items:
        sentences = item["content"].split(". ")
        current_chunk = ""
        for sentence in sentences:
            test = f"{current_chunk}. {sentence}" if current_chunk else sentence
            if len(test) > 800 and current_chunk:
                chunks.append({
                    "id": f"{item['id']}_{len(chunks)}",
                    "title": item["title"],
                    "route": item["route"],
                    "section": item["section"],
                    "source_type": item["source_type"],
                    "content": current_chunk.strip(),
                })
                current_chunk = sentence
            else:
                current_chunk = test
        if current_chunk.strip():
            chunks.append({
                "id": f"{item['id']}_{len(chunks)}",
                "title": item["title"],
                "route": item["route"],
                "section": item["section"],
                "source_type": item["source_type"],
                "content": current_chunk.strip(),
            })
    return chunks


def ingest_website_content():
    print("[Ingest] Starting website content ingestion...")
    chunks = _chunk_content(WEBSITE_CONTENT)
    print(f"[Ingest] Created {len(chunks)} chunks from {len(WEBSITE_CONTENT)} pages")

    batch_size = 20
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        texts = [c["content"] for c in batch]
        print(f"[Ingest] Embedding batch {i // batch_size + 1}/{(len(chunks) - 1) // batch_size + 1}...")

        embeddings = generate_embeddings(texts)
        ids = [c["id"] for c in batch]
        documents = [c["content"] for c in batch]
        metadatas = [
            {
                "title": c["title"],
                "route": c["route"],
                "section": c["section"],
                "source_type": c["source_type"],
            }
            for c in batch
        ]

        add_documents(ids, embeddings, metadatas, documents)

    stats = get_collection_stats()
    print(f"[Ingest] Done. Total vectors in store: {stats['count']}")
    return stats


def ingest_pdf_chunks(pdf_chunks: list[dict]):
    print(f"[Ingest] Ingesting {len(pdf_chunks)} PDF chunks...")
    batch_size = 20
    for i in range(0, len(pdf_chunks), batch_size):
        batch = pdf_chunks[i : i + batch_size]
        texts = [c["content"] for c in batch]
        embeddings = generate_embeddings(texts)
        ids = [c["id"] for c in batch]
        documents = [c["content"] for c in batch]
        metadatas = [
            {
                "title": c["title"],
                "route": c.get("route", "#"),
                "section": c["section"],
                "source_type": "pdf",
                "filename": c.get("filename", ""),
                "file_path": c.get("file_path", ""),
                "page_number": str(c.get("page_number", 0)),
            }
            for c in batch
        ]
        add_documents(ids, embeddings, metadatas, documents)

    stats = get_collection_stats()
    print(f"[Ingest] Done. Total vectors in store: {stats['count']}")
    return stats


if __name__ == "__main__":
    ingest_website_content()
