from .embeddings import generate_single_embedding
from .vectorstore import query_collection
import re


# Query expansion: map common terms to better search phrases
QUERY_EXPANSIONS = {
    "ceo": "chief executive officer managing director chairman leadership",
    "chairman": "chairman managing director board of directors leadership",
    "director": "board of directors managing director leadership",
    "managing director": "managing director chairman leadership",
    "revenue": "revenue from operations total income sales turnover",
    "profit": "profit after tax net profit PAT earnings",
    "employees": "employee strength manpower team workforce headcount",
    "sustainability": "sustainability environment carbon net zero green esg climate",
    "esg": "esg sustainability environment social governance carbon net zero",
    "api": "active pharmaceutical ingredients API manufacturing drug",
    "acquired": "acquisition acquired purchased bought merger takeover",
    "acquisition": "acquisition acquired purchased bought merger takeover senn chemicals auctus",
    "acquisitions": "acquisition acquired purchased bought merger takeover senn chemicals auctus",
    "bought": "acquisition acquired purchased bought merger takeover",
    "subsidiary": "subsidiary subsidiaries group company owned affiliate",
    "product": "product API portfolio drug medicine tablet capsule formulation",
    "products": "product API portfolio drug medicine tablet capsule formulation",
    "medicine": "medicine drug tablet capsule formulation pharmaceutical",
    "drug": "drug medicine tablet capsule formulation pharmaceutical",
    "financial": "financial revenue EBITDA PAT profit quarterly results",
    "quarterly": "quarterly results Q1 Q2 Q3 Q4 revenue EBITDA PAT",
    "leadership": "leadership team chairman managing director CEO board",
    "team": "leadership team chairman managing director CEO board management",
    "who is": "name title position role leadership team",
    "what is": "definition overview description about",
    "where": "location address facility plant",
    "when": "year date founded established started history",
    "how": "process method approach system",
    "headquarters": "headquarters office location address Hyderabad India",
    "founded": "founded established started year history",
    "history": "history founded established started year milestone",
    "milestone": "milestone achievement award recognition year",
    "award": "award recognition achievement honor",
    "certification": "certification quality compliance ISO FDA",
    "quality": "quality compliance ISO FDA regulatory",
    "compliance": "compliance regulatory quality ISO FDA",
    "export": "export country market global international",
    "countries": "country market global international presence",
    "global": "global international market country presence",
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


def calculate_relevance_score(chunk: dict, query: str) -> float:
    """Calculate how relevant a chunk is to the query (0-1)."""
    content = chunk.get("content", "").lower()
    metadata = chunk.get("metadata", {})
    title = metadata.get("title", "").lower()
    query_lower = query.lower()
    
    score = 0.0
    max_score = 0.0
    
    # Check for direct keyword matches in content
    query_words = [w for w in re.split(r'\W+', query_lower) if len(w) > 2]
    for word in query_words:
        max_score += 1.0
        if word in content:
            score += 1.0
        elif word in title:
            score += 0.8
    
    # Check for phrase matches
    if query_lower in content:
        score += 2.0
        max_score += 2.0
    elif any(phrase in content for phrase in query_lower.split()):
        score += 1.0
        max_score += 2.0
    
    # Title relevance bonus
    title_words = [w for w in re.split(r'\W+', title) if len(w) > 2]
    for word in query_words:
        if word in title_words:
            score += 0.5
    
    # Distance penalty (lower distance = better)
    distance = chunk.get("distance", 1.0)
    distance_score = max(0, 1.0 - distance) * 0.5
    
    if max_score > 0:
        return (score / max_score) * 0.7 + distance_score
    return distance_score


async def retrieve_relevant_chunks(query: str, n_results: int = 5) -> list[dict]:
    """Retrieve relevant chunks with quality filtering."""
    expanded = expand_query(query)
    query_embedding = generate_single_embedding(expanded)
    results = query_collection(query_embedding, n_results)
    
    if not results.get("documents") or not results["documents"][0]:
        return []
    
    chunks = []
    for i in range(len(results["documents"][0])):
        chunk = {
            "content": results["documents"][0][i],
            "metadata": results["metadatas"][0][i] if results.get("metadatas") else {},
            "distance": results["distances"][0][i] if results.get("distances") else 1.0,
        }
        
        # Calculate relevance score
        relevance = calculate_relevance_score(chunk, query)
        chunk["relevance"] = relevance
        
        # Filter out low-relevance chunks (threshold: 0.1)
        if relevance >= 0.1:
            chunks.append(chunk)
    
    # Sort by relevance (highest first)
    chunks.sort(key=lambda x: x.get("relevance", 0), reverse=True)
    
    # Return top results
    return chunks[:n_results]
