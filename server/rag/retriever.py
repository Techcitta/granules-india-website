from .embeddings import generate_single_embedding
from .vectorstore import query_collection


# Query expansion: map common terms to better search phrases
QUERY_EXPANSIONS = {
    "ceo": "chief executive officer managing director chairman",
    "chairman": "chairman managing director board of directors",
    "director": "board of directors managing director",
    "revenue": "revenue from operations total income",
    "profit": "profit after tax net profit PAT",
    "employees": "employee strength manpower team",
    "sustainability": "sustainability environment carbon net zero green esg",
    "esg": "esg sustainability environment social governance carbon net zero",
    "api": "active pharmaceutical ingredients API manufacturing",
    "acquired": "acquisition acquired purchased bought merger takeover",
    "acquisition": "acquisition acquired purchased bought merger takeover senn chemicals auctus",
    "acquisitions": "acquisition acquired purchased bought merger takeover senn chemicals auctus",
    "bought": "acquisition acquired purchased bought merger takeover",
    "subsidiary": "subsidiary subsidiaries group company owned",
    "product": "product API portfolio drug medicine tablet capsule",
    "financial": "financial revenue EBITDA PAT profit quarterly results",
    "quarterly": "quarterly results Q1 Q2 Q3 Q4 revenue EBITDA PAT",
}


def expand_query(query: str) -> str:
    """Expand query with related terms for better retrieval."""
    query_lower = query.lower()
    expansions = []
    for key, expansion in QUERY_EXPANSIONS.items():
        if key in query_lower:
            expansions.append(expansion)
    if expansions:
        return query + " " + " ".join(expansions)
    return query


async def retrieve_relevant_chunks(query: str, n_results: int = 10) -> list[dict]:
    expanded = expand_query(query)
    query_embedding = generate_single_embedding(expanded)
    results = query_collection(query_embedding, n_results)

    if not results.get("documents") or not results["documents"][0]:
        return []

    chunks = []
    for i in range(len(results["documents"][0])):
        chunks.append({
            "content": results["documents"][0][i],
            "metadata": results["metadatas"][0][i] if results.get("metadatas") else {},
            "distance": results["distances"][0][i] if results.get("distances") else 1.0,
        })

    return chunks
