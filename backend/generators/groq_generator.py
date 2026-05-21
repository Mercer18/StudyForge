import os
from groq import Groq
from dotenv import load_dotenv
import json
import time

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_subject_knowledge_graph(extracted_text: str, subject_title: str) -> dict:
    """
    Takes the extracted text from a document and generates the structured learning workspace JSON.
    Implements a map-reduce style chunking to handle massive documents without severe truncation.
    """
    
    chunk_size = 15000
    # Split text into chunks
    chunks = [extracted_text[i:i+chunk_size] for i in range(0, len(extracted_text), chunk_size)]
    
    # Cap at 10 chunks (150,000 chars) for MVP to avoid insanely long processing times or rate limits.
    max_chunks = 10
    chunks_to_process = chunks[:max_chunks]
    
    master_study_data = {
        "title": subject_title,
        "overview": "",
        "sections": [],
        "flashcards": []
    }
    
    print(f"Processing {len(chunks_to_process)} chunks for Deep Forge...")
    
    chunk_errors = []
    
    for idx, chunk in enumerate(chunks_to_process):
        print(f"Processing chunk {idx + 1}/{len(chunks_to_process)}...")
        
        prompt = f"""
        You are the StudyForge "Deep Forge" AI tutor. Analyze this specific chunk of a larger document for the subject "{subject_title}".
        Transform this raw text into a highly structured "Knowledge Graph" JSON object.
        
        CRITICAL FORMATTING RULES:
        1. **Mathematical Formulas:** You MUST use LaTeX formatting for ANY mathematical expression, equation, or variable. Inline math must be `$math$` and block math `$$math$$`. DO NOT skip this.
        2. **Key Terms:** ALWAYS **bold** crucial vocabulary and concepts.
        3. **Mind Maps & Diagrams:** Whenever explaining a complex process, relationship, or architecture (like Neural Networks, pipelines, etc.), you MUST generate a Mermaid.js diagram enclosed in a markdown code block (e.g. ```mermaid ... ```) within the content string.
        4. **OCR Typos:** The text is extracted from a PDF and may contain ligature errors (e.g., "Diusion" instead of "Diffusion"). You MUST silently correct these obvious spelling errors.
        5. Do not hallucinate. Use ONLY the provided text chunk.

        The JSON MUST have the exact following structure:
        {{
            "overview": "A 1 sentence summary of this specific chunk.",
            "sections": [
                {{
                    "title": "Section Title",
                    "content": "A highly detailed markdown explanation. Use bullet points, bold text, LaTeX math, and Mermaid diagrams where applicable.",
                    "key_concepts": ["concept 1", "concept 2"]
                }}
            ],
            "flashcards": [
                {{
                    "front": "A question testing a key concept",
                    "back": "The concise answer (can include $math$)"
                }}
            ]
        }}
        
        Document Chunk:
        {chunk}
        
        Output ONLY valid JSON. No markdown wrappers around the JSON block. Do not say "Here is the JSON".
        """
        
        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a strict JSON-only API. You must return strictly valid, raw JSON with no trailing commas or markdown wrapping."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3,
                max_tokens=4096,
                response_format={"type": "json_object"}
            )
            
            result_content = response.choices[0].message.content
            chunk_data = json.loads(result_content)
            
            import uuid
            
            # Reduce step: Merge into master
            if idx == 0:
                master_study_data["overview"] = chunk_data.get("overview", "")
            
            for sec in chunk_data.get("sections", []):
                sec["id"] = str(uuid.uuid4())
                master_study_data["sections"].append(sec)
                
            for fc in chunk_data.get("flashcards", []):
                fc["id"] = str(uuid.uuid4())
                master_study_data["flashcards"].append(fc)
            
            # Respect rate limits (Groq allows ~30 RPM, but adding a delay helps TPM limits)
            time.sleep(3)
            
        except Exception as e:
            print(f"Error generating chunk {idx + 1}: {e}")
            chunk_errors.append(f"Chunk {idx + 1} Error: {str(e)}")
            time.sleep(3)
            continue # If one chunk fails, skip it and continue merging others
            
    # If entirely failed, provide fallback
    if len(master_study_data["sections"]) == 0:
        error_details = "\\n".join(chunk_errors)
        return {
            "title": subject_title,
            "overview": "Failed to generate content.",
            "sections": [{
                "id": "error",
                "title": "Parsing Error",
                "content": f"The Deep Forge engine encountered an error while processing the chunks.\\n\\n**Debug Info:**\\n{error_details}",
                "key_concepts": []
            }],
            "flashcards": []
        }
        
    return master_study_data
