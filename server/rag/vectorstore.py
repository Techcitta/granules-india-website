from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from pathlib import Path
import uuid

_client = None
COLLECTION_NAME = "granules_knowledge"
VECTOR_SIZE = 384  # all-MiniLM-L6-v2 dimension
PERSIST_DIR = str(Path(__file__).resolve().parent.parent / ".qdrant_store")


def get_client():
    global _client
    if _client is not None:
        return _client
    Path(PERSIST_DIR).mkdir(parents=True, exist_ok=True)
    _client = QdrantClient(path=PERSIST_DIR)
    # Create collection if it doesn't exist
    collections = [c.name for c in _client.get_collections().collections]
    if COLLECTION_NAME not in collections:
        _client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
        )
    return _client


def add_documents(ids: list[str], embeddings: list[list[float]], metadatas: list[dict], documents: list[str]):
    client = get_client()
    points = []
    for doc_id, embedding, metadata, document in zip(ids, embeddings, metadatas, documents):
        payload = {**metadata, "document": document}
        for k, v in payload.items():
            if not isinstance(v, (str, int, float, bool, type(None))):
                payload[k] = str(v)
        points.append(PointStruct(
            id=str(uuid.uuid5(uuid.NAMESPACE_URL, doc_id)),
            vector=embedding,
            payload=payload,
        ))
    batch_size = 100
    for i in range(0, len(points), batch_size):
        client.upsert(collection_name=COLLECTION_NAME, points=points[i:i + batch_size])


def query_collection(query_embedding: list[float], n_results: int = 6):
    client = get_client()
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=n_results,
    )
    documents = []
    metadatas = []
    distances = []
    for hit in results.points:
        documents.append(hit.payload.get("document", ""))
        metadatas.append({k: v for k, v in hit.payload.items() if k != "document"})
        distances.append(hit.score)
    return {
        "documents": [documents],
        "metadatas": [metadatas],
        "distances": [distances],
    }


def get_collection_stats():
    client = get_client()
    try:
        info = client.get_collection(COLLECTION_NAME)
        return {"count": info.points_count or 0}
    except Exception:
        return {"count": 0}
