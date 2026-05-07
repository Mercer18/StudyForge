import json
import uuid
from parsers.pdf_parser import extract_text_from_pdf_bytes
from parsers.youtube_parser import extract_text_from_youtube
from generators.groq_generator import generate_subject_knowledge_graph
from services.supabase_client import supabase

def process_document_pipeline(subject_id: str, file_bytes: bytes, filename: str, subject_title: str):
    """
    The main background pipeline that:
    1. Extracts text from the document.
    2. Sends text to Groq to generate the structured knowledge graph.
    3. Uploads the JSON to Supabase Storage.
    4. Updates the Subject row in Postgres to 'completed' with the storage URL.
    """
    try:
        # Update status to processing (just in case)
        supabase.table("subjects").update({"status": "processing"}).eq("id", subject_id).execute()
        
        # 1. Extract Text
        print(f"[{subject_id}] Extracting text from {filename}...")
        extracted_text = extract_text_from_pdf_bytes(file_bytes)
        
        if not extracted_text.strip():
            raise ValueError("No text could be extracted from the document.")
            
        # 2. Generate Knowledge Graph via Groq
        print(f"[{subject_id}] Generating knowledge graph...")
        study_data = generate_subject_knowledge_graph(extracted_text, subject_title)
        
        # 3. Upload JSON to Supabase Storage
        print(f"[{subject_id}] Uploading generated data to Supabase Storage...")
        json_bytes = json.dumps(study_data).encode('utf-8')
        
        # Ensure the bucket exists (We assume "studyforge-files" bucket is created by the user)
        bucket_name = "studyforge-files"
        storage_path = f"{subject_id}/study_data.json"
        
        # Upload the json file (upsert=True allows overwriting if it exists)
        supabase.storage.from_(bucket_name).upload(
            file=json_bytes,
            path=storage_path,
            file_options={"content-type": "application/json", "upsert": "true"}
        )
        
        # Get the public URL
        study_data_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        
        # 4. Update Database
        print(f"[{subject_id}] Updating database...")
        supabase.table("subjects").update({
            "status": "completed",
            "study_data_url": study_data_url
        }).eq("id", subject_id).execute()
        
        print(f"[{subject_id}] Pipeline completed successfully!")
        
    except Exception as e:
        print(f"[{subject_id}] Pipeline failed: {e}")
        supabase.table("subjects").update({
            "status": "failed",
            "description": str(e)
        }).eq("id", subject_id).execute()

def process_youtube_pipeline(subject_id: str, youtube_url: str, subject_title: str):
    """
    Background pipeline for YouTube videos:
    1. Extracts transcript from YouTube URL.
    2. Sends text to Groq.
    3. Uploads JSON to Supabase Storage.
    4. Updates Postgres row.
    """
    try:
        supabase.table("subjects").update({"status": "processing"}).eq("id", subject_id).execute()
        
        # 1. Extract Text
        print(f"[{subject_id}] Extracting transcript from {youtube_url}...")
        extracted_text = extract_text_from_youtube(youtube_url)
        
        if not extracted_text.strip():
            raise ValueError("No transcript could be extracted from the video (it may not have captions).")
            
        # 2. Generate Knowledge Graph via Groq
        print(f"[{subject_id}] Generating knowledge graph...")
        study_data = generate_subject_knowledge_graph(extracted_text, subject_title)
        
        # 3. Upload JSON to Supabase Storage
        print(f"[{subject_id}] Uploading generated data to Supabase Storage...")
        json_bytes = json.dumps(study_data).encode('utf-8')
        
        bucket_name = "studyforge-files"
        storage_path = f"{subject_id}/study_data.json"
        
        supabase.storage.from_(bucket_name).upload(
            file=json_bytes,
            path=storage_path,
            file_options={"content-type": "application/json", "upsert": "true"}
        )
        
        study_data_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        
        # 4. Update Database
        print(f"[{subject_id}] Updating database...")
        supabase.table("subjects").update({
            "status": "completed",
            "study_data_url": study_data_url
        }).eq("id", subject_id).execute()
        
        print(f"[{subject_id}] YouTube Pipeline completed successfully!")
        
    except Exception as e:
        print(f"[{subject_id}] YouTube Pipeline failed: {e}")
        supabase.table("subjects").update({
            "status": "failed",
            "description": str(e)
        }).eq("id", subject_id).execute()
