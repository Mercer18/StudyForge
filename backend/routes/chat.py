import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from services.supabase_client import supabase
from groq import Groq
from services.auth import get_current_user
from services.pipeline import get_embedding_model

router = APIRouter()
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/{subject_id}")
async def chat_with_document(
    subject_id: str,
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    """
    Vector RAG: Vectorizes query, searches Supabase pgvector database,
    and queries Llama-3 with the context. Falls back to storage raw text
    for older subjects.
    """
    try:
        # 0. Enforce tenant isolation / ownership check
        subject_res = supabase.table("subjects").select("user_id").eq("id", subject_id).execute()
        if not subject_res.data:
            raise HTTPException(status_code=404, detail="Subject not found")
        if subject_res.data[0]["user_id"] != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You do not own this subject")
            
        # 1. Retrieve the latest user query from the messages list
        user_query = ""
        for msg in reversed(request.messages):
            if msg.role == "user":
                user_query = msg.content
                break
                
        context_text = ""
        
        # 2. Try to run Vector Similarity Search if we have a query
        if user_query.strip():
            try:
                print(f"[{subject_id}] Vectorizing query: '{user_query}'")
                model = get_embedding_model()
                query_vector = list(model.embed([user_query]))[0].tolist()
                
                # Perform cosine similarity search via Postgres RPC
                print(f"[{subject_id}] Querying Supabase pgvector store...")
                rpc_res = supabase.rpc("match_document_embeddings", {
                    "query_embedding": query_vector,
                    "match_threshold": 0.3,
                    "match_count": 5,
                    "filter_subject_id": subject_id
                }).execute()
                
                if rpc_res.data:
                    print(f"[{subject_id}] Vector search found {len(rpc_res.data)} matching context chunks.")
                    context_text = "\n\n---\n\n".join([chunk["content"] for chunk in rpc_res.data])
                else:
                    print(f"[{subject_id}] No vector matches found. Falling back to storage raw text.")
            except Exception as ve:
                print(f"[{subject_id}] Vector RAG search failed: {ve}. Falling back to storage raw text.")
                
        # 3. Fallback: If no vector context could be retrieved, use the older storage stuffer RAG
        if not context_text:
            bucket_name = "studyforge-files"
            storage_path = f"{subject_id}/raw_text.txt"
            
            try:
                res = supabase.storage.from_(bucket_name).download(storage_path)
                context_text = res.decode('utf-8')
            except Exception:
                res = supabase.storage.from_(bucket_name).download(f"{subject_id}/study_data.json")
                context_text = res.decode('utf-8')
            
            # Truncate raw text to fit context window safely (~20,000 characters)
            if len(context_text) > 20000:
                context_text = context_text[:20000] + "\n\n...[TEXT TRUNCATED DUE TO CONTEXT LIMITS]..."

        # 4. Construct Prompt
        system_prompt = f"""You are the StudyForge Chat Tutor, a highly intelligent and helpful AI academic assistant.
Your goal is to answer the user's question strictly based on the provided document context. 

DOCUMENT CONTEXT:
=================
{context_text}
=================

RULES:
1. ONLY use the document context provided above.
2. If the user asks something completely unrelated to the text (e.g. "What is the capital of France?", "Write a poem about dogs"), politely refuse and remind them you can only answer questions about the study material.
3. If the answer is not in the text, say "I cannot find the answer to that in the current document."
4. Be concise, clear, and academic in your tone.
5. ALWAYS format your responses using rich Markdown. If presenting multiple points, you MUST use markdown bullet points (`- `) or numbered lists (`1. `). Use bold text (`**`) to highlight key terms.
"""
        
        # 5. Prepare messages for Groq
        api_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            # only allow user/assistant roles
            if msg.role in ["user", "assistant"]:
                api_messages.append({"role": msg.role, "content": msg.content})
                
        # 6. Call Groq
        chat_completion = groq_client.chat.completions.create(
            messages=api_messages,
            model="llama-3.1-8b-instant",
            temperature=0.3, # Low temperature for more factual responses
            max_tokens=1000
        )
        
        reply = chat_completion.choices[0].message.content
        
        return {"reply": reply}
        
    except HTTPException as he:
        # Re-raise HTTPExceptions (like 404, 403)
        raise he
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
