import os
from groq import Groq
from dotenv import load_dotenv
import json

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def generate_subject_knowledge_graph(extracted_text: str, subject_title: str) -> dict:
    """
    Takes the extracted text from a document and generates the structured learning workspace JSON
    using the Groq API (llama3-8b-8192 or llama3-70b-8192 for better logic).
    """
    
    # We truncate the text to avoid hitting token limits, though Groq supports 8k. 
    # In a full production app, you would chunk this and iterate. For MVP, we'll take the first ~12k chars to avoid free tier TPM limits.
    safe_text = extracted_text[:12000]
    
    prompt = f"""
    You are an expert AI tutor. I am going to provide you with text extracted from a study document for the subject "{subject_title}".
    Your job is to transform this raw text into a highly structured "Knowledge Graph" JSON object that will be used to render an interactive textbook microsite.
    
    The JSON MUST have the exact following structure:
    {{
        "title": "Overall Subject Title",
        "overview": "A 2-3 sentence summary of the entire document",
        "sections": [
            {{
                "id": "section-1",
                "title": "Section Title",
                "content": "A highly detailed, well-formatted markdown explanation of the concepts in this section. Use bullet points, bold text, and clear paragraphs. Do not hallucinate, use only the provided text.",
                "key_concepts": ["concept 1", "concept 2"]
            }}
            // ... at least 3-5 sections based on the text
        ],
        "flashcards": [
            {{
                "id": "fc-1",
                "front": "A question testing a key concept",
                "back": "The concise answer"
            }}
            // ... at least 5-10 flashcards
        ]
    }}
    
    Document Text:
    {safe_text}
    
    Output ONLY valid JSON. No markdown wrappers around the JSON block. Do not say "Here is the JSON".
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a JSON-only API. You must return strictly valid, raw JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result_content = response.choices[0].message.content
        return json.loads(result_content)
    except Exception as e:
        print(f"Error generating knowledge graph with Groq: {e}")
        # Return a fallback schema so the frontend doesn't crash completely
        return {
            "title": subject_title,
            "overview": "Failed to generate content due to an error.",
            "sections": [
                {
                    "id": "error-1",
                    "title": "Error Parsing Document",
                    "content": "There was an error generating the knowledge graph from this document.",
                    "key_concepts": []
                }
            ],
            "flashcards": []
        }
