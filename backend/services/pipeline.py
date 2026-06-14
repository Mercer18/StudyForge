import json
import uuid
from parsers.document_parser import extract_text_from_document
from parsers.youtube_parser import extract_text_from_youtube
from generators.groq_generator import generate_subject_knowledge_graph, generate_mind_map
from services.supabase_client import supabase
from services.text_splitter import split_text_recursive
from fastembed import TextEmbedding

# Thread-safe lazy-loaded embedding model
_embedding_model = None

def get_embedding_model():
    """
    Lazily loads the FastEmbed TextEmbedding model (BAAI/bge-small-en-v1.5) on first call.
    This prevents slow startup of FastAPI and downloads the model on demand.
    """
    global _embedding_model
    if _embedding_model is None:
        print("Initializing FastEmbed TextEmbedding model (BAAI/bge-small-en-v1.5)...")
        _embedding_model = TextEmbedding()
    return _embedding_model

def index_document_vectors(subject_id: str, extracted_text: str):
    """
    Semantic chunking, vector embedding generation, and bulk PostgreSQL vector insertion.
    """
    print(f"[{subject_id}] Starting vector indexing pipeline...")
    
    # 1. Chunk text into small overlapping paragraphs
    chunks = split_text_recursive(extracted_text, max_chunk_size=1000, overlap=200)
    if not chunks:
        print(f"[{subject_id}] No chunks generated for indexing.")
        return
        
    print(f"[{subject_id}] Generated {len(chunks)} text chunks for Vector RAG.")
    
    # 2. Get the embedding model and embed chunks in batch
    model = get_embedding_model()
    print(f"[{subject_id}] Generating embeddings for {len(chunks)} chunks...")
    embeddings = list(model.embed(chunks))
    
    # 3. Formulate the database rows
    rows = []
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        rows.append({
            "subject_id": subject_id,
            "chunk_index": i,
            "content": chunk,
            "embedding": emb.tolist()  # Convert numpy float32 array to serializable Python float list
        })
        
    # 4. Bulk insert vectors in batches of 100 to avoid payload limit errors
    batch_size = 100
    for start_idx in range(0, len(rows), batch_size):
        batch = rows[start_idx:start_idx + batch_size]
        print(f"[{subject_id}] Inserting vector batch {start_idx // batch_size + 1} ({len(batch)} chunks)...")
        supabase.table("document_embeddings").insert(batch).execute()
        
    print(f"[{subject_id}] Vector indexing pipeline completed successfully!")

def process_document_pipeline(subject_id: str, file_bytes: bytes, filename: str, subject_title: str):
    """
    The main background pipeline that:
    1. Extracts text from the document.
    2. Sends text to Groq to generate the structured knowledge graph.
    3. Uploads the JSON to Supabase Storage.
    4. Indexes the extracted text into the vector database.
    5. Updates the Subject row in Postgres to 'completed' with the storage URL.
    """
    try:
        # Update status to processing (just in case)
        supabase.table("subjects").update({"status": "processing"}).eq("id", subject_id).execute()
        
        # 1. Extract Text
        print(f"[{subject_id}] Extracting text from {filename}...")
        extracted_text = extract_text_from_document(file_bytes, filename)
        
        if not extracted_text.strip():
            raise ValueError("No text could be extracted from the document.")
            
        # 2. Generate Knowledge Graph via Groq
        print(f"[{subject_id}] Generating knowledge graph...")
        study_data = generate_subject_knowledge_graph(extracted_text, subject_title)
        
        # 3. Upload JSON to Supabase Storage
        print(f"[{subject_id}] Uploading generated data to Supabase Storage...")
        json_bytes = json.dumps(study_data).encode('utf-8')
        
        # Ensure the bucket exists
        bucket_name = "studyforge-files"
        storage_path = f"{subject_id}/study_data.json"
        
        # Upload the json file
        supabase.storage.from_(bucket_name).upload(
            file=json_bytes,
            path=storage_path,
            file_options={"content-type": "application/json", "upsert": "true"}
        )
        
        # Also upload raw text for Chat Tutor fallback
        print(f"[{subject_id}] Uploading raw text to Supabase Storage...")
        raw_text_bytes = extracted_text.encode('utf-8')
        raw_storage_path = f"{subject_id}/raw_text.txt"
        supabase.storage.from_(bucket_name).upload(
            file=raw_text_bytes,
            path=raw_storage_path,
            file_options={"content-type": "text/plain", "upsert": "true"}
        )
        
        # Get the public URL
        study_data_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        
        # 3.5. Index Document Vectors for RAG Chat Tutor
        try:
            index_document_vectors(subject_id, extracted_text)
        except Exception as ve:
            print(f"[{subject_id}] Vector indexing failed (continuing anyway): {ve}")
            
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
    4. Indexes the transcript into the vector database.
    5. Updates Postgres row.
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
        
        # Also upload raw text for Chat Tutor fallback
        print(f"[{subject_id}] Uploading raw text to Supabase Storage...")
        raw_text_bytes = extracted_text.encode('utf-8')
        raw_storage_path = f"{subject_id}/raw_text.txt"
        supabase.storage.from_(bucket_name).upload(
            file=raw_text_bytes,
            path=raw_storage_path,
            file_options={"content-type": "text/plain", "upsert": "true"}
        )
        
        study_data_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        
        # 3.5. Index Document Vectors for RAG Chat Tutor
        try:
            index_document_vectors(subject_id, extracted_text)
        except Exception as ve:
            print(f"[{subject_id}] Vector indexing failed (continuing anyway): {ve}")
            
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

def process_forge_map_pipeline(subject_id: str):
    """
    On-demand pipeline that recovers/forges a missing mind map:
    1. Downloads existing study_data.json from storage.
    2. Runs the mind map Groq model based on pre-compiled sections.
    3. Re-uploads the complete JSON with mind_map populated.
    4. Automatically falls back to full generation if JSON is corrupt or missing.
    """
    try:
        supabase.table("subjects").update({"status": "processing"}).eq("id", subject_id).execute()
        bucket_name = "studyforge-files"
        storage_path = f"{subject_id}/study_data.json"
        
        study_data = None
        try:
            json_bytes = supabase.storage.from_(bucket_name).download(storage_path)
            study_data = json.loads(json_bytes.decode('utf-8'))
        except Exception as se:
            print(f"[{subject_id}] Failed to download or parse study_data.json: {se}")
            # Try parsing raw text if JSON doesn't exist
            raw_storage_path = f"{subject_id}/raw_text.txt"
            raw_bytes = supabase.storage.from_(bucket_name).download(raw_storage_path)
            raw_text = raw_bytes.decode('utf-8')
            
            subject_res = supabase.table("subjects").select("title").eq("id", subject_id).execute()
            title = subject_res.data[0]["title"] if subject_res.data else "Subject Workspace"
            
            study_data = generate_subject_knowledge_graph(raw_text, title)
            if not study_data:
                raise Exception("Failed to generate study workspace from raw text")

        title = study_data.get("title", "Subject Workspace")
        sections = study_data.get("sections", [])
        
        print(f"[{subject_id}] Forging new mind map for {title}...")
        mind_map = generate_mind_map(title, sections)
        
        study_data["mind_map"] = mind_map
        
        # Upload updated JSON
        updated_bytes = json.dumps(study_data).encode('utf-8')
        supabase.storage.from_(bucket_name).upload(
            file=updated_bytes,
            path=storage_path,
            file_options={"content-type": "application/json", "upsert": "true"}
        )
        
        study_data_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        
        supabase.table("subjects").update({
            "status": "completed",
            "study_data_url": study_data_url
        }).eq("id", subject_id).execute()
        
        print(f"[{subject_id}] Mind map forging pipeline finished successfully!")
        
    except Exception as e:
        print(f"[{subject_id}] Mind map forging failed: {e}")
        supabase.table("subjects").update({
            "status": "failed",
            "description": f"Mind map forging failed: {str(e)}"
        }).eq("id", subject_id).execute()
