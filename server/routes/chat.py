import os
import re
from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from rag.retriever import retrieve_relevant_chunks
from rag.vectorstore import get_collection_stats

router = APIRouter()

SYSTEM_PROMPT = """You are Granules India's AI assistant. Answer questions about Granules India Limited clearly and concisely.

RULES:
1. Give a direct, clear answer in 2-3 sentences maximum.
2. Use the provided context to answer. Cite ONE source using [Source: Title] [Quote: "exact quote"] format.
3. Be conversational and natural - answer like a helpful assistant, not a robot.
4. For leadership questions: state name and title clearly.
5. For financial questions: include specific numbers.
6. For product questions: mention the product name and key details.
7. Never say "I don't have enough information" unless completely unrelated to Granules.
8. If the question is about general knowledge (not Granules), answer naturally without sources.

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

# Patterns that indicate questions NOT about Granules India
IRRELEVANT_PATTERNS = [
    r'\bwhat\s+is\s+\d+\s*[\+\-\*\/\%]\s*\d+',  # math: what is 2+2
    r'\b\d+\s*[\+\-\*\/\%]\s*\d+\s*[=\?]',       # math: 2+2= or 2+2?
    r'\b(weather|temperature|time|date|day)\b',     # general info
    r'\b(recipe|cook|food|restaurant)\b',           # food
    r'\b(movie|music|song|actor|actress)\b',        # entertainment
    r'\b(sports|football|cricket|tennis)\b',        # sports
    r'\b(who\s+(is|was)\s+(the\s+)?president|who\s+invented)\b',  # general knowledge
    r'\b(translate|definition|meaning\s+of)\b',     # language
    r'\b(2\s*\+\s*2|1\s*\+\s*1|3\s*\*\s*3)\b',   # specific math
]


def is_greeting(message: str) -> bool:
    return message.strip().lower().rstrip("!.") in GREETING_PATTERNS


def is_irrelevant_to_granules(message: str) -> bool:
    """Check if the question is completely unrelated to Granules India."""
    msg_lower = message.lower().strip()

    # Check if it's a math question
    for pattern in IRRELEVANT_PATTERNS:
        if re.search(pattern, msg_lower):
            # Double check - if it also mentions granules, it might be relevant
            granules_keywords = ['granules', 'pharma', 'api', 'senn', 'acquisition', 'esg', 'sustainability']
            if any(kw in msg_lower for kw in granules_keywords):
                return False
            return True

    return False


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if is_greeting(req.message):
        return ChatResponse(
            answer="Hello! How can I assist you with information about Granules India Limited today?",
            sources=[],
        )

    # Handle irrelevant questions (math, general knowledge, etc.)
    if is_irrelevant_to_granules(req.message):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel(
        model_name="gemini-flash-latest",
        system_instruction="Answer the question directly and concisely. Do not include any citations or sources.",
        )
        response = model.generate_content(
            req.message,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=500,
            ),
        )
        return ChatResponse(
            answer=response.text + "\n\n*Note: This is a general knowledge question. For questions about Granules India, I can provide detailed answers with sources.*",
            sources=[],
        )

    stats = get_collection_stats()
    if stats["count"] == 0:
        return ChatResponse(
            answer="I haven't been set up yet. Please run the ingestion pipeline first.",
            sources=[],
        )

    chunks = await retrieve_relevant_chunks(req.message, n_results=3)
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
        model_name="gemini-flash-latest",
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

    # Check if the answer contains any source citations
    # Extract titles - handle both formats: "Title" and "Title (/route)"
    cited_titles = set()
    for match in re.findall(r'\[Source: (.*?)\]', answer):
        # Strip route if present: "Title (/route)" -> "Title"
        title = re.sub(r'\s*\(/.*?\)\s*$', '', match).strip()
        if title:
            cited_titles.add(title)

    # If no sources cited in answer, return without sources
    if not cited_titles:
        return ChatResponse(answer=answer, sources=[])

    # Extract quotes: [Quote: "..."]
    quotes_by_source = {}
    for match in re.finditer(r'\[Source: (.*?)\].*?\[Quote: "(.*?)"\]', answer):
        src = match.group(1)
        # Strip route if present
        src = re.sub(r'\s*\(/.*?\)\s*$', '', src).strip()
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

    def validate_citation_matches_query(quote: str, query: str) -> bool:
        """Validate that the citation quote is relevant to the query."""
        if not quote:
            return True  # No quote to validate
        
        quote_lower = quote.lower()
        query_lower = query.lower()
        
        # Extract key terms from query
        query_terms = [w for w in re.split(r'\W+', query_lower) if len(w) > 2]
        
        # Check if any query term appears in the quote
        for term in query_terms:
            if term in quote_lower:
                return True
        
        # Check for semantic matches
        semantic_matches = {
            'ceo': ['chief executive officer', 'managing director', 'chairman'],
            'leader': ['chief executive officer', 'managing director', 'chairman', 'director'],
            'head': ['chief executive officer', 'managing director', 'chairman', 'director'],
            'product': ['api', 'drug', 'tablet', 'capsule', 'formulation', 'medicine'],
            'revenue': ['revenue', 'sales', 'income', 'turnover'],
            'profit': ['profit', 'pat', 'earnings', 'margin'],
            'employee': ['employee', 'team', 'staff', 'workforce'],
            'location': ['location', 'address', 'office', 'facility'],
        }
        
        for query_term, synonyms in semantic_matches.items():
            if query_term in query_lower:
                for synonym in synonyms:
                    if synonym in quote_lower:
                        return True
        
        return False

    sources = []
    for c in chunks:
        title = c["metadata"].get("title", "Unknown")
        if title in cited_titles:
            source_quotes = quotes_by_source.get(title, [])
            route = c["metadata"].get("route", "#")
            # Derive section key from route for highlighting (e.g. /business/api -> api)
            section = route.strip("/").split("/")[-1] if route and route != "#" else ""
            
            # Validate that the citation matches the query
            quote = source_quotes[0] if source_quotes else None
            if quote and not validate_citation_matches_query(quote, req.message):
                continue  # Skip this citation if it doesn't match the query
            
            sources.append({
                "title": title,
                "route": route,
                "section": section,
                "snippet": extract_relevant_snippet(c["content"], req.message),
                "proof": quote,
                "source_type": c["metadata"].get("source_type", "website"),
                "filename": c["metadata"].get("filename"),
                "file_path": c["metadata"].get("file_path"),
                "page_number": c["metadata"].get("page_number"),
            })
            break  # Only return 1 source

    return ChatResponse(answer=answer, sources=sources)


@router.get("/chat/stats")
async def chat_stats():
    return get_collection_stats()
