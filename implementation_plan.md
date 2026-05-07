# StudyForge: Phase 1 MVP Implementation Plan

The pivot to a **Document-to-Learning Workspace Generator** is a massive upgrade. It moves the project from a generic "AI app" to a tangible product with a highly differentiated output: the **ForgeBook** (personal textbook microsite).

This plan outlines the architecture, database schema, and API endpoints needed to deliver the **Phase 1 MVP**, keeping the scope tight and focused on the core "upload -> generate -> study" loop.

## User Review Required

> [!IMPORTANT]
> Please review the MVP scope, database schema, and API endpoints below. If this aligns with your vision, approve the plan and we will begin scaffolding the Next.js frontend and FastAPI backend.

## 1. Phase 1 MVP Scope

We are building only what is necessary to demonstrate the core value proposition:
1. **Auth & Dashboard:** Basic login and a dashboard to view generated subjects.
2. **Multi-File Upload:** Drag-and-drop document upload (focusing on PDF/Docx text extraction first).
3. **Processing Pipeline (Backend):** 
   - Extract text -> Clean -> Chunk
   - Groq API calls to generate Sections, Summaries, and Flashcards.
4. **ForgeBook (Frontend):** 
   - A Next.js-powered microsite that consumes the generated JSON.
   - Includes Reader Mode, Flashcards (ForgeCards), and the Focus Timer (Flow Mode).

> [!WARNING]  
> **Scope Creep Alert:** Semantic search, chat with notes, and the Syllabus Coverage Engine are deferred to Phase 2 to ensure we ship a robust MVP quickly.

---

## 2. Proposed Architecture

### Frontend (Next.js + Tailwind + Shadcn)
- **App Router:** For server-side rendering of the workspaces and SEO benefits.
- **State:** Zustand or React Context for managing the generated `study-data` and Flow Mode timers.
- **Deployment:** Vercel

### Backend (FastAPI + Python)
- **API Server:** Handles file uploads and orchestrates the AI pipeline.
- **AI Pipeline:** Uses `PyMuPDF` for PDF extraction and `Groq` for high-speed LLM generation.
- **Deployment:** Railway or Render

### Database & Storage (Supabase)
- **Postgres:** Relational data for users, subjects, and focus sessions.
- **Storage:** Buckets for raw uploaded files and the generated `study-data.json` blobs.

---

## 3. Database Schema (Supabase / Postgres)

```sql
-- Users (handled mostly by Supabase Auth, but we can extend if needed)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects / Workspaces
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    study_data_url TEXT, -- Link to the generated JSON in Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded Documents (Raw files)
CREATE TABLE public.uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Supabase Storage URL
    extracted_text TEXT, -- Optional: raw text if we want to store it in DB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Focus Sessions (Flow Mode analytics)
CREATE TABLE public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    subject_id UUID REFERENCES public.subjects(id),
    duration_minutes INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> [!TIP]  
> By storing the massive generated knowledge graph as a JSON blob in Supabase Storage (`study_data_url`) rather than deeply nested relational tables, we optimize for read speed and simplicity on the frontend, avoiding the bottleneck of parsing massive DB queries.

---

## 4. API Endpoints (FastAPI)

### Authentication & Users
*(Mostly handled directly from Next.js to Supabase via frontend client, but we will have backend middleware to verify Supabase JWTs).*

### Subject Generation Pipeline
- `POST /api/v1/subjects/generate`
  - **Payload:** Multipart form data (Upload files, Subject Title)
  - **Action:** 
    1. Creates `Subject` row with status `processing`.
    2. Uploads files to Supabase Storage.
    3. Spawns background task (or celery worker) for the pipeline.
  - **Response:** `subject_id`

- `GET /api/v1/subjects/{subject_id}/status`
  - **Action:** Polling endpoint for the frontend to check generation progress.

### The Pipeline Flow (Background Task)
1. **Extract:** Read PDF/Docx from Supabase Storage.
2. **Clean/Chunk:** Split into semantic chunks.
3. **Generate Structure:** Ask Groq to output an overall Table of Contents.
4. **Generate Content:** Iterate through TOC and ask Groq to summarize chunks and generate Flashcards.
5. **Assemble:** Combine into a massive JSON object (`study_data`).
6. **Save:** Upload JSON to Supabase Storage and update `Subject` status to `completed`.

### Focus Analytics
- `POST /api/v1/focus/record`
  - **Payload:** `{ subject_id, duration_minutes }`
  - **Action:** Logs a completed Flow Mode session.

---

## 5. Phase 3: The Reader Workspace (Microsite)

This is the final core piece of the MVP. When the user clicks a completed Subject Card on their dashboard, they will be taken to `/subject/[id]`, which serves as their interactive textbook.

### 5.1 Proposed UI Architecture
The layout will use a robust dual-pane design:

**Left Sidebar (Navigation)**
- **Overview:** Shows the 2-3 sentence AI summary of the entire document.
- **Table of Contents (TOC):** A clickable list of all generated `sections`. Clicking a section updates the main view.
- **Study Tools:** A toggle to switch the main view from "Reader Mode" to "Flashcards".

**Main Content Area**
- **Reader Mode:** Renders the active section's `content` (Markdown) beautifully formatted with Tailwind typography. Displays `key_concepts` as pill badges at the top.
- **Flashcard Mode:** An interactive card-flipping UI that maps through the `flashcards` array, allowing users to test their knowledge.

### 5.2 Data Fetching Flow
1. Next.js Server Component receives the `[id]` parameter.
2. Fetches the `subject` row from Supabase Postgres.
3. Extracts the `study_data_url` and performs a standard HTTP GET to retrieve the JSON generated by Groq.
4. Passes the parsed JSON into a Client Component (`WorkspaceClient.tsx`) which manages the active section state and tabs.

## User Review Required

> [!IMPORTANT]
> The Reader Workspace will define the entire look and feel of StudyForge. Does the dual-pane layout (Sidebar + Reader/Flashcards) align with your vision? If so, approve this plan and I will begin building the UI!

---

## 6. Verification Plan

1. **Backend Tests:** Upload a sample syllabus and mock notes PDF. Verify that FastAPI correctly parses the text and Groq generates a valid, parsable JSON structure matching our expected schema.
2. **Frontend Tests:** Load the generated JSON into the Next.js microsite and verify that Reader Mode, Flashcards, and navigation render smoothly without blocking the main thread.
