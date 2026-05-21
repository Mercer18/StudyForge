import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from services.supabase_client import supabase
from groq import Groq
from services.auth import get_current_user

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
    Retrieves raw text from storage, builds a RAG prompt, and streams/returns response.
    """
    try:
        # 0. Enforce tenant isolation / ownership check
        subject_res = supabase.table("subjects").select("user_id").eq("id", subject_id).execute()
        if not subject_res.data:
            raise HTTPException(status_code=404, detail="Subject not found")
        if subject_res.data[0]["user_id"] != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You do not own this subject")
            
        # 1. Fetch raw text from Supabase
        bucket_name = "studyforge-files"
        storage_path = f"{subject_id}/raw_text.txt"
        
        # Try to download raw text. If it fails (e.g. for older subjects), fallback to study_data.json
        try:
            res = supabase.storage.from_(bucket_name).download(storage_path)
            raw_text = res.decode('utf-8')
        except Exception:
            res = supabase.storage.from_(bucket_name).download(f"{subject_id}/study_data.json")
            raw_text = res.decode('utf-8')
        
        # Truncate raw text to fit context window safely (~25,000 chars roughly to fit inside 8k limit safely)
        # 8k tokens is approx 30k chars. We leave some room for instructions and output.
        if len(raw_text) > 20000:
            raw_text = raw_text[:20000] + "\n\n...[TEXT TRUNCATED DUE TO CONTEXT LIMITS]..."

        # 2. Construct Prompt
        system_prompt = f"""You are the StudyForge Chat Tutor, a highly intelligent and helpful AI academic assistant.
Your goal is to answer the user's question strictly based on the provided document text. 

DOCUMENT CONTEXT:
=================
{raw_text}
=================

RULES:
1. ONLY use the document context provided above.
2. If the user asks something completely unrelated to the text (e.g. "What is the capital of France?", "Write a poem about dogs"), politely refuse and remind them you can only answer questions about the study material.
3. If the answer is not in the text, say "I cannot find the answer to that in the current document."
4. Be concise, clear, and academic in your tone.
5. ALWAYS format your responses using rich Markdown. If presenting multiple points, you MUST use markdown bullet points (`- `) or numbered lists (`1. `). Use bold text (`**`) to highlight key terms.
"""
        
        # 3. Prepare messages for Groq
        api_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            # only allow user/assistant roles
            if msg.role in ["user", "assistant"]:
                api_messages.append({"role": msg.role, "content": msg.content})
                
        # 4. Call Groq
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
