import os
import re
from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from rag.retriever import retrieve_relevant_chunks
from rag.vectorstore import get_collection_stats

router = APIRouter()

SYSTEM_PROMPT = """You are Granules India's official AI assistant. You answer questions about Granules India Limited, a vertically integrated pharmaceutical company headquartered in Hyderabad, India.

RULES:
1. Answer using the provided context. Extract relevant facts and give a clear, direct answer.
2. Always cite your sources using [Source: Title] notation after each fact.
3. The context contains information from annual reports, quarterly results, investor presentations, and website content. Use ALL of it to answer.
4. Be concise, professional, and helpful. Start with a direct answer.
5. Use markdown formatting (bullet points, bold text).
6. For leadership questions, state the person's name and title clearly.
7. For financial questions, include specific numbers and the reporting period.
8. Never say "I don't have enough information" unless the context is completely unrelated to the question.
9. After each fact, include the exact quote from the source document in [Quote] notation. Example: Dr. K.V.S. Ram Rao is the CEO [Source: Integrated Report FY24 25] [Quote: "Dr. K.V.S. Ram Rao, Joint Managing Director & Chief Executive Officer"]

CONTEXT:
"""


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


GREETING_PATTERNS = {
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
    "how are you", "what's up", "sup", "yo", "hii", "helo", "hiiii",
    "good day", "greetings", "howdy", "hi there", "hello there",
}


def is_greeting(message: str) -> bool:
    return message.strip().lower().rstrip("!.") in GREETING_PATTERNS


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if is_greeting(req.message):
        return ChatResponse(
            answer="Hello! How can I assist you with information about Granules India Limited today?",
            sources=[],
        )

    stats = get_collection_stats()
    if stats["count"] == 0:
        return ChatResponse(
            answer="I haven't been set up yet. Please run the ingestion pipeline first.",
            sources=[],
        )

    chunks = await retrieve_relevant_chunks(req.message, n_results=8)
    if not chunks:
        return ChatResponse(
            answer="I couldn't find relevant information. Please try rephrasing your question.",
            sources=[],
        )

    context_block = "\n\n".join(
        f"[{i+1}] Source: {c['metadata'].get('title', 'Unknown')} ({c['metadata'].get('route', '')})\n{c['content']}"
        for i, c in enumerate(chunks)
    )

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=SYSTEM_PROMPT,
    )
    response = model.generate_content(
        SYSTEM_PROMPT + context_block + "\n\nUser question: " + req.message,
        generation_config=genai.types.GenerationConfig(
            temperature=0.3,
            max_output_tokens=1500,
        ),
    )

    answer = response.text

    # Extract cited source titles and quotes from the answer text
    cited_titles = set(re.findall(r'\[Source: (.*?)\]', answer))

    # Extract quotes: [Quote: "..."]
    quotes_by_source = {}
    for match in re.finditer(r'\[Source: (.*?)\].*?\[Quote: "(.*?)"\]', answer):
        src = match.group(1)
        quote = match.group(2)
        if src not in quotes_by_source:
            quotes_by_source[src] = []
        quotes_by_source[src].append(quote)

    def extract_relevant_snippet(content: str, query: str) -> str:
        """Find the most relevant sentence in the chunk based on the query."""
        query_words = [w.lower() for w in query.split() if len(w) > 2]
        sentences = re.split(r'(?<=[.!?])\s+', content)
        best = ""
        best_score = -1
        for s in sentences:
            s_lower = s.lower()
            score = sum(2 if w in s_lower else 0 for w in query_words)
            if re.search(r'\d', s) and any(w in s_lower for w in ['revenue', 'profit', 'margin', 'ebitda', 'pat', 'crore', 'lakh', 'million', 'billion', '₹', 'rs']):
                score += 3
            if any(w in s_lower for w in ['ceo', 'chairman', 'managing director', 'director', 'president', 'chief']):
                score += 3
            if score > best_score:
                best_score = score
                best = s
        if not best and sentences:
            best = sentences[0]
        if len(best) > 200:
            best = best[:197] + "..."
        return best.strip()

    sources = []
    for c in chunks:
        title = c["metadata"].get("title", "Unknown")
        if title in cited_titles:
            source_quotes = quotes_by_source.get(title, [])
            sources.append({
                "title": title,
                "route": c["metadata"].get("route", "#"),
                "snippet": extract_relevant_snippet(c["content"], req.message),
                "proof": source_quotes[0] if source_quotes else None,
                "source_type": c["metadata"].get("source_type", "website"),
                "filename": c["metadata"].get("filename"),
                "file_path": c["metadata"].get("file_path"),
                "page_number": c["metadata"].get("page_number"),
            })

    if not sources:
        for c in chunks[:2]:
            title = c["metadata"].get("title", "Unknown")
            sources.append({
                "title": title,
                "route": c["metadata"].get("route", "#"),
                "snippet": extract_relevant_snippet(c["content"], req.message),
                "proof": None,
                "source_type": c["metadata"].get("source_type", "website"),
                "filename": c["metadata"].get("filename"),
                "file_path": c["metadata"].get("file_path"),
                "page_number": c["metadata"].get("page_number"),
            })

    return ChatResponse(answer=answer, sources=sources)


@router.get("/chat/stats")
async def chat_stats():
    return get_collection_stats()
