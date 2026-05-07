import fitz  # PyMuPDF
import io

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    """
    text_content = []
    try:
        # Open the PDF from bytes
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text = page.get_text("text")
            # Basic cleanup: remove excessive newlines
            clean_text = " ".join(text.split())
            if clean_text:
                text_content.append(f"--- Page {page_num + 1} ---\n{clean_text}\n")
                
        return "\n".join(text_content)
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        raise e
