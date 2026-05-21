# The Deep Forge Engine 🌋

Welcome to Phase 6. StudyForge is no longer just generating "summaries"—it is now generating deeply technical, highly structured textbooks directly from massive documents.

## What Was Implemented

1. **Map-Reduce Architecture**
   - Previously, the backend truncated any text beyond 12,000 characters.
   - Now, the `groq_generator.py` slices massive documents and 3-hour YouTube transcripts into 15,000-character chunks. 
   - It iterates through each chunk, asking the Llama-3 model to deeply analyze the section, extract flashcards, and write detailed markdown. Finally, it merges all these chunks together into one massive, comprehensive `study_data.json` blob.

2. **Rich Content Enforcement**
   - The LLM prompt has been rewritten with strict "CRITICAL FORMATTING RULES".
   - It is now forced to use `LaTeX` syntax for any mathematical formulas or equations.
   - It is forced to heavily utilize `**bold**` text for critical vocabulary.
   - **Mind Maps:** It is instructed to generate `mermaid.js` code blocks whenever it needs to explain complex relationships or architectures.

3. **Authentication UX Overhaul:**
    *   **Unified Auth Modal:** Replaced the standalone `/login` page with a professional tabbed `AuthModal` popup, allowing users to sign up or log in without leaving the main landing page.
    *   **Username Support:** Extended the Supabase `profiles` table schema and backend `auth-actions.ts` to support login via `Email` OR `Username`.
    *   **Auth Resolution:** Implemented server-side Admin Client logic to resolve `usernames` to `emails` during login, bridging the gap between custom user identity and Supabase Auth.
*   **Landing Page Revamp:** 
    *   Updated hero content to focus on **Interactive Microsites** and support for **PDF, PPT, DOCX, and YouTube**.
    *   Integrated a **Theme Toggle** directly into the homepage navbar.
    *   Polished the design with better spacing, responsive fonts, and theme-aware feature cards.

4. **Frontend Visual Upgrades**
   - I installed the `mermaid` package into your Next.js application.
   - I built a custom `<Mermaid>` React component that securely intercepts these generated code blocks and renders them natively as beautiful, dark-themed SVG flowcharts directly inside the Reader Workspace.

## How to Test

1. **The Ultimate Stress Test:** Find an extremely long YouTube video (e.g., a 2-hour crash course on Calculus, Machine Learning, or System Design).
2. **Upload it:** Paste the URL into the StudyForge modal. 
   - *Note: Because it is now performing map-reduce across multiple chunks, the processing time will be slightly longer. Check your backend terminal to watch it iterate through the chunks in real time!*
3. **Be Amazed:** Open the workspace. You should see an incredibly long Table of Contents, perfect LaTeX formulas, and interactive SVG Mind Maps rendered right in the browser!
