from sentence_transformers import SentenceTransformer

_model = None

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    model = _get_model()
    embeddings = model.encode(texts, show_progress_bar=False)
    return embeddings.tolist()


def generate_single_embedding(text: str) -> list[float]:
    model = _get_model()
    embedding = model.encode([text])
    return embedding[0].tolist()
