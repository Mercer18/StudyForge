import os
from groq import Groq
from dotenv import load_dotenv
import json
import time
from services.text_splitter import split_text_recursive
from services.llm_client import complete

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_subject_knowledge_graph(extracted_text: str, subject_title: str) -> dict:
    """
    Takes the extracted text from a document and generates the structured learning workspace JSON.
    Implements a map-reduce style chunking to handle massive documents without severe truncation.
    """
    
    # Use our recursive text splitter to ensure layout and formulas aren't sliced mid-way
    # We use 3500 characters to stay safely below the Groq 6000 tokens-per-minute (TPM) free tier limit
    chunks = split_text_recursive(extracted_text, max_chunk_size=3500, overlap=400)
    
    # Cap at 25 chunks (~110,000 chars) to allow decent length files while remaining fast
    max_chunks = 25
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
        
        prompt = rf"""
        You are the StudyForge "Deep Forge" AI tutor. Analyze this text chunk for the subject "{subject_title}".
        Generate a highly structured learning "Knowledge Graph" JSON object.
        
        RULES:
        1. **Math (CRITICAL):** Put ONLY real mathematical expressions inside `$...$` (inline) or `$$...$$` (block) — NEVER wrap a full sentence in math delimiters. Inside these JSON string values, every LaTeX backslash MUST be DOUBLED so the JSON stays valid. Use proper commands: `\\frac`, `\\sum`, `\\sqrt`, `\\int`, `\\alpha`, `\\nabla`, and `\\text{{...}}` for words inside math.
           CORRECT: "Gradient descent: $$x_{{t+1}} = x_t - \\eta \\nabla f(x_t)$$ where $\\eta$ is the learning rate."
           WRONG: "$$Hill Climbing: choose a random solution x_0 in S$$"  (prose in math mode + single backslashes).
        2. **Formatting:** Use **double asterisks** to bold crucial vocabulary (never inside math).
        3. **Diagrams:** Use ```mermaid ... ``` inside sections when explaining complex pipelines/processes.
        4. **Flashcard Density:** Extract 5 to 8 distinct, high-yield flashcards covering algorithms, formulas, parameters, and key concepts.
        5. **Flashcard Format:**
           - "front": a direct active-recall question (e.g., "What is the formula for L2 regularization?").
           - "back": the precise answer — put any formula in `$$...$$` with double-escaped backslashes, and keep explanations as plain prose OUTSIDE the math.
        6. Do not hallucinate. Use ONLY the provided text chunk.

        JSON structure:
        {{
            "overview": "1 sentence summary.",
            "sections": [
                {{
                    "title": "Section Title",
                    "content": "Detailed markdown explanation with bullet points, bold terms, LaTeX, and Mermaid where applicable.",
                    "key_concepts": ["concept 1"]
                }}
            ],
            "flashcards": [
                {{
                    "front": "Active recall question?",
                    "back": "Precise answer."
                }}
            ]
        }}
        
        Text Chunk:
        {chunk}
        
        Output strictly raw JSON.
        """
        
        success = False
        retries = 3
        backoff = 4
        
        for attempt in range(retries):
            try:
                result_content = complete(
                    "You are a strict JSON-only API. Return strictly valid, raw JSON with no trailing commas or markdown wrapping. Any LaTeX in string values MUST use double backslashes (e.g. \\\\frac, \\\\sum, \\\\text) so the JSON stays valid.",
                    prompt,
                    json_mode=True,
                    temperature=0.3,
                    max_tokens=4096,
                )
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
                
                success = True
                # Small politeness delay; the LLM cascade absorbs bursts/429s via failover.
                time.sleep(1)
                break
                
            except Exception as e:
                err_msg = str(e)
                print(f"Error generating chunk {idx + 1} (Attempt {attempt + 1}/{retries}): {err_msg}")
                if attempt < retries - 1:
                    sleep_time = backoff * (attempt + 1)
                    if "limit" in err_msg.lower() or "413" in err_msg or "429" in err_msg or "rate" in err_msg.lower():
                        sleep_time = 8 * (attempt + 1)
                        print(f"Detected rate/token limit error. Backing off for {sleep_time} seconds before retry...")
                    else:
                        print(f"Retrying in {sleep_time} seconds...")
                    time.sleep(sleep_time)
                else:
                    chunk_errors.append(f"Chunk {idx + 1} Error after {retries} retries: {err_msg}")
                    
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
            "flashcards": [],
            "mind_map": {
                "title": subject_title,
                "columns": [],
                "cross_cutting": []
            }
        }
        
    # Generate Mind Map
    print(f"[{subject_title}] Synthesizing multi-column Syllabus Mind Map (ForgeMap)...")
    try:
        master_study_data["mind_map"] = generate_mind_map(subject_title, master_study_data["sections"])
    except Exception as mme:
        print(f"Failed to generate mind map: {mme}")
        master_study_data["mind_map"] = {
            "title": subject_title,
            "columns": [],
            "cross_cutting": []
        }

    return master_study_data


def generate_mind_map(subject_title: str, sections: list) -> dict:
    """
    Generates a structured syllabus mind map for the subject based on the generated sections.
    """
    sections_summary = []
    # Limit to first 12 sections to keep prompt size very small and stay safely below token limits
    for s in sections[:12]:
        sections_summary.append({
            "title": s.get("title", ""),
            "key_concepts": s.get("key_concepts", [])[:3] # Limit to top 3 key concepts per section
        })
    
    sections_json = json.dumps(sections_summary)
    
    prompt = f"""
    You are the StudyForge "Deep Forge" AI designer. Analyze the following sections and key concepts synthesized for the subject "{subject_title}":
    {sections_json}
    
    Design a comprehensive multi-column Syllabus Mind Map JSON structure for "{subject_title}".
    Break down the subject into 6 to 10 high-level columns (units), and extract 4 to 6 cross-cutting concepts at the bottom.
    
    RULES:
    1. Organize into at least 6 and up to 10 units (columns).
    2. Colors: Choose only from: 'blue', 'emerald', 'purple', 'amber', 'teal', 'rose', 'indigo', 'cyan', 'pink', 'violet'.
    3. Icons: Appropriate Lucide icon name (e.g., 'book-open', 'code', 'palette', 'layout', 'server', 'database', 'shield', 'cpu', 'terminal', 'layers', 'wrench', 'search').
    4. Topics: Under each unit, create 3 to 5 topics. Each topic has a title and 2 to 3 very short details.
    5. Cross-cutting: Define 4 to 6 global cross-cutting concepts with details.
    
    JSON structure:
    {{
        "title": "{subject_title}",
        "columns": [
            {{
                "id": 1,
                "title": "Unit 1 Title",
                "color": "blue",
                "icon": "book-open",
                "topics": [
                    {{
                        "title": "Topic A",
                        "details": ["Detail 1", "Detail 2"]
                    }}
                ]
            }}
        ],
        "cross_cutting": [
            {{
                "title": "Concept X",
                "details": ["Detail X1", "Detail X2"]
            }}
        ]
    }}
    
    Output strictly raw JSON.
    """
    
    retries = 3
    backoff = 4
    for attempt in range(retries):
        try:
            result_content = complete(
                "You are a strict JSON-only API. Return strictly valid, raw JSON with no trailing commas or markdown wrapping.",
                prompt,
                json_mode=True,
                temperature=0.3,
                max_tokens=2048,
            )
            mind_map_data = json.loads(result_content)
            return mind_map_data
        except Exception as e:
            err_msg = str(e)
            print(f"Error generating mind map (Attempt {attempt + 1}/{retries}): {err_msg}")
            if attempt < retries - 1:
                sleep_time = backoff * (attempt + 1)
                if "limit" in err_msg.lower() or "413" in err_msg or "429" in err_msg or "rate" in err_msg.lower():
                    sleep_time = 8 * (attempt + 1)
                    print(f"Detected rate/token limit error in mind map. Backing off for {sleep_time} seconds before retry...")
                else:
                    print(f"Retrying mind map generation in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                # Return fallback mind map if all retries fail
                print("All retries failed for mind map. Generating fallback...")
                fallback = {
                    "title": subject_title,
                    "columns": [],
                    "cross_cutting": [
                        {
                            "title": "General Standards",
                            "details": ["Best Practices", "Core Principles"]
                        }
                    ]
                }
                colors = ['blue', 'emerald', 'purple', 'amber', 'teal', 'rose', 'indigo', 'cyan']
                icons = ['book-open', 'code', 'palette', 'layout', 'server', 'database', 'shield', 'cpu']
                for idx, sec in enumerate(sections[:8]):
                    fallback["columns"].append({
                        "id": idx + 1,
                        "title": sec.get("title", f"Unit {idx+1}"),
                        "color": colors[idx % len(colors)],
                        "icon": icons[idx % len(icons)],
                        "topics": [
                            {
                                "title": concept,
                                "details": ["Introduction", "Applications"]
                            } for concept in sec.get("key_concepts", [])[:4]
                        ]
                    })
                return fallback

