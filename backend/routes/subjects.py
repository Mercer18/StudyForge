from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.supabase_client import supabase
from services.pipeline import process_document_pipeline, process_youtube_pipeline

router = APIRouter()

class SubjectStatusResponse(BaseModel):
    id: str
    status: str
    study_data_url: Optional[str] = None
    description: Optional[str] = None

@router.post("/generate")
async def generate_subject(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...),
    user_id: str = Form(...)
):
    """
    Endpoint to receive a document upload, create a subject row, 
    and kick off the background processing pipeline.
    """
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported currently.")
        
    try:
        # Read file bytes in memory (for MVP, careful with massive files)
        file_bytes = await file.read()
        
        # Ensure user exists in profiles table to prevent foreign key errors
        supabase.table("profiles").upsert({"id": user_id}).execute()
        
        # 1. Create the Subject in Supabase
        subject_data = {
            "user_id": user_id,
            "title": title,
            "status": "processing"
        }
        
        response = supabase.table("subjects").insert(subject_data).execute()
        
        if not response.data:
            raise Exception("Failed to insert subject into database.")
            
        subject_id = response.data[0]['id']
        
        # 2. Add pipeline to background tasks
        background_tasks.add_task(
            process_document_pipeline,
            subject_id=subject_id,
            file_bytes=file_bytes,
            filename=file.filename,
            subject_title=title
        )
        
        return {"subject_id": subject_id, "status": "processing"}
        
    except Exception as e:
        print(f"Error in /generate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-youtube")
async def generate_subject_from_youtube(
    background_tasks: BackgroundTasks,
    youtube_url: str = Form(...),
    title: str = Form(...),
    user_id: str = Form(...)
):
    """
    Endpoint to receive a YouTube URL, create a subject row, 
    and kick off the background processing pipeline.
    """
    if "youtube.com" not in youtube_url and "youtu.be" not in youtube_url:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL.")
        
    try:
        supabase.table("profiles").upsert({"id": user_id}).execute()
        
        subject_data = {
            "user_id": user_id,
            "title": title,
            "status": "processing"
        }
        
        response = supabase.table("subjects").insert(subject_data).execute()
        
        if not response.data:
            raise Exception("Failed to insert subject into database.")
            
        subject_id = response.data[0]['id']
        
        background_tasks.add_task(
            process_youtube_pipeline,
            subject_id=subject_id,
            youtube_url=youtube_url,
            subject_title=title
        )
        
        return {"subject_id": subject_id, "status": "processing"}
        
    except Exception as e:
        print(f"Error in /generate-youtube: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{subject_id}/status", response_model=SubjectStatusResponse)
async def get_subject_status(subject_id: str):
    """
    Polling endpoint to check if the background pipeline is complete.
    """
    response = supabase.table("subjects").select("*").eq("id", subject_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    subject = response.data[0]
    return SubjectStatusResponse(
        id=subject["id"],
        status=subject["status"],
        study_data_url=subject.get("study_data_url"),
        description=subject.get("description")
    )
