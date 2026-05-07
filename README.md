# StudyForge 🚀

*"Transforming chaotic study materials into personalized interactive learning workspaces."*

StudyForge is a next-generation AI study companion designed to ingest static academic materials (like PDFs, DOCX files, and YouTube Lectures) and forge them into highly interactive, beautifully designed learning environments. 

This project is currently in its fundamental **MVP (Minimum Viable Product)** stage. It successfully executes its core mission but is built to serve as a foundational layer for much more advanced, highly-competitive AI tutoring features in the near future.

---

## 🌟 Current Features & State

Right now, StudyForge successfully handles the fundamental pipeline of AI-assisted learning:

*   **Multi-Modal Ingestion:** 
    *   **PDFs & Word Docs:** Uses `PyMuPDF` to strip raw text from your academic files.
    *   **YouTube Videos:** Uses `youtube-transcript-api` to instantly extract closed captions from any supported YouTube link.
*   **The "Forge" Processor:** We utilize the ultra-fast Groq Llama-3 API to read the extracted text and generate a structured JSON Knowledge Graph representing the core concepts of the material.
*   **The Reader Workspace:** A premium, dark-themed (glassmorphism) reading environment optimized for academic retention. Features custom typography (Inter/Outfit) designed for extended reading sessions.
*   **Smart Flashcards:** Instantly generates interactive flashcards directly from the source material to test retention.

### ⚠️ Current Limitations & Boundary Conditions
Because we are at a fundamental stage, there are strict limits to how the app currently behaves:
*   **Upload Limits:** The system currently passes the raw extracted text directly to the Groq API. Since LLMs have context window limits (~8k-128k tokens depending on the model), extremely large textbook PDFs will either truncate or cause a token limit error. 
*   **Image-Only PDFs:** If you upload a scanned PDF consisting *only* of images (no OCR text), our parser cannot read it. The system will safely reject it and notify you that no text was found.
*   **Simple Extraction:** It's doing what it needs to do on a basic level. Complex tables and charts are currently ignored during text extraction.

---

## 🔭 The Vision & Future Roadmap

Our vision is to evolve StudyForge to surpass current industry leaders like Turbo.ai and Knowt. We are not stopping at basic text extraction.

**Phase 5 & 6 Targets:**
1.  **AI Chat Tutor Sidebar:** A RAG-enabled sliding sidebar in the Reader Workspace that allows you to chat dynamically with the specific document you are reading.
2.  **Advanced Document Chunking:** Utilizing Vector Databases (Pinecone/Supabase pgvector) to semantically chunk massive 500-page textbooks so you can query the entire book without hitting token limits.
3.  **Gamification & "The Forge Leveling System":** Rewarding students with XP for completing flashcard sets and maintaining study streaks.
4.  **Interactive Mind Maps:** Visual representations of the generated Knowledge Graph.
5.  **Multi-modal Vision AI:** Processing diagrams and charts using GPT-4V or Llama-3-Vision.

---

## 🛠️ Testing the Application

If you want to try out the current state of the application without creating an account, you can use our built-in tester credentials:

*   **Email:** `alex1802005@gmail.com`
*   **Password:** `ballerzinsights`

---

## 💻 How to Run Locally

To run this application locally, you will need to start both the Next.js Frontend Server and the FastAPI Backend Server.

### Option 1: The Quick Start (Windows Only)
If you are on Windows, simply double click the `start_all.bat` file in the root directory.
*This will open two black terminal windows—one running the Python backend and one running the Node frontend. Keep both windows open!*

### Option 2: Manual Start (Mac/Linux/Windows)

**1. Start the Backend (Terminal 1)**
```bash
cd backend
# Activate your virtual environment (e.g., source venv/bin/activate)
pip install -r requirements.txt
fastapi dev main.py
```

**2. Start the Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.
