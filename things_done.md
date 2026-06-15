# StudyForge — Work Log (`things_done.md`)

Running record of changes made by Claude, starting **2026-06-13**. Newest day on top.
Claude does **not** commit or push — these changes sit in the working tree until the user commits them.

---

## 2026-06-13 (v2) — Full from-scratch reimagining ("The Knowledge Press")

User rejected the v1 dark-blue/glass direction entirely ("reimagine everything — theme, font, logo, copy; keep only the cursor; choose *some* modern tech, no chaos"). Rebuilt the identity:

- **New design system** (`globals.css`): dropped cold blue for a warm editorial palette — "Bone" paper + "Ink" type + a single "Ember" accent (oklch); light default with a dark "Ink" mode. Kept the cursor + Lenis CSS and all utilities other pages rely on.
- **New typography** (`layout.tsx`): **Fraunces** (display serif) + **Space Grotesk** (UI) + **JetBrains Mono** (labels), swapped via the `@theme` font vars so the whole site inherits them. Default theme now `light`.
- **New logo** (`logo-mark.tsx`): an ember "press seal" with a negative-space spark + a `Logo` lockup (serif "Study*forge*"). Replaces the voxel logo in navbar/footer.
- **New navbar** (`navbar.tsx`): editorial hairline top bar, mono small-caps links, solid pill CTA — no more glass pill.
- **New 3D centerpiece** (`three/hero-object.tsx`): a single **custom-GLSL molten core** (Ashima simplex vertex displacement + fresnel ember rim, Float, sparks, subtle Bloom) on a dark "stage". Replaces the nebula blob.
- **Landing fully rewritten** (`page.tsx`): editorial hero ("Raw material in, *understanding* out"), ingest marquee, numbered **Method**, editorial **Features** grid, clean **FAQ**, ember closing CTA, minimal footer. New honest copy. GSAP `Reveal` reveals + Lenis.
- **Removed** the v1 nebula + Rapier physics scenes (`forge-scene/forge-showcase/hero-canvas.tsx` deleted). Trimmed the stack to cursor + Lenis + GSAP + one R3F/GLSL object + Framer micro-motion.
- Verified (preview :3000): HTTP 200, Fast Refresh clean, simplex shader compiles, **no console errors**.

> Note: the new theme/fonts/cursor already propagate site-wide, but the **dashboard, workspace/reader, and auth modal layouts** still carry their old structure + voxel logo — next phase.

**Update (same day):** Per user feedback, **removed the molten-core 3D hero** entirely (deleted `three/hero-object.tsx`) and reflowed the hero into a clean **full-width editorial** layout (headline + subcopy + CTAs over the ingest marquee). The landing now ships **no WebGL** — pure type + GSAP/Lenis/Framer + the custom cursor. (HTTP 200, no app console errors; the `<script>`-tag warning seen via the preview harness is that tool inspecting Next's hydration scripts, not an app issue.)

**Update (same day) — theme-reactive hero backdrop:** added `hero-backdrop.tsx` (pure CSS/SVG, no WebGL): ember focal glow + slow concentric "forge rings" + masked ember dot-grid + rising sparks + legibility fades. All keyed off `var(--primary)`/`var(--foreground)` + `dark:` opacity, so it re-skins instantly on the light/dark toggle. Wired behind the hero (`relative isolate` / `z-10` content). Added `hero-spin`, `hero-breathe`, `ember-rise` keyframes.

**Update (same day) — App pages, phase 2 (auth + dashboard):**
- **Auth modal** (`auth-modal.tsx`): editorial restyle — press-seal `LogoMark`, mono kicker, Fraunces title ("Back to the *forge*" / "Start *forging*"), mono uppercase field labels, full-width ember pill submits. **All functional wires kept**: field names (`identifier`/`password`/`username`/`email`), `formAction={login/signup}`, Suspense + `useSearchParams` error display, tab toggle.
- **Dashboard** (`dashboard/page.tsx`): swapped voxel `AnimatedLogo` → press-seal `Logo`; editorial backdrop-blur header; Fraunces "The *library*" heading; bespoke editorial subject cards (ember hover rule, replaced the old `amber-500` gradient) + editorial empty state. Removed now-unused `Button`/`Card` imports. **Server-component data fetch, links, Delete/Upload/Logout untouched.**
- **Upload trigger** (`upload-modal.tsx`): trigger pill rounded to match nav/landing CTAs (internals/engine-console flow left intact).
- Verified (:3000): `/` 200, `/dashboard` 307 (auth redirect — proves module+JSX compiled), no console errors.

**Update (same day) — App pages, phase 2 (workspace):**
- **Subject page** (`subject/[id]/page.tsx`): replaced the hardcoded `bg-[#050409]` + voxel-logo + amber "Forging…" screen with a **theme-aware ember forge-ring loader** (spinning SVG rings around the press seal); editorial backdrop-blur header (Library ← / Fraunces title); editorial 404 + load-error states. Dropped `Button`/`AnimatedLogo` imports.
- **Workspace** (`workspace-client.tsx`): fixed the chat FAB's hardcoded **gold** shadow (`rgba(226,183,20)`) → ember round pill; reader section title now mono-kicker + Fraunces-light (was `font-extrabold` w/ gradient bar); flashcards heading editorialized. Timer console / tabs / TOC left intact (already ember + theme-aware).
- **Removed** dead `animated-logo.tsx` (old cyan voxel logo, fully unreferenced after the logo swap).
- **Left intentionally:** mind-map's per-branch categorical colors (data-viz that aids comprehension) and upload-modal's `slate-950` "terminal" progress view (terminals read dark in both themes).
- Verified (:3000): `/` 200, `/dashboard` + `/subject/*` 307 (auth redirect — full module graphs compiled), no console errors.

**Update (same day) — login fix + verify-email + checkpoint:**
- **Login diagnosis:** `signInWithPassword` failures were all collapsed to "Invalid credentials". Most likely real cause = **unconfirmed email** (signup requires verification; dev SMTP often doesn't deliver, so accounts stay unconfirmed). Fixed `auth-actions.ts` `login()` to surface the real reason (unconfirmed-email + rate-limit get distinct messages). Actual unblock is Supabase-side: confirm the user, or disable "Confirm email" for dev.
- **verify-email** page editorialized (Fraunces + ember + mono kicker; dropped the orange-600 orb, bounce, and `Button`).
- **Checkpoint commit** `807cfa5` on `main` ("Knowledge Press editorial redesign") — 32 files; scratch/diff/sample artifacts + `.claude/` intentionally excluded. Not pushed.

> Internal theming now covers every auth-gated screen (dashboard, workspace reader/cards/mindmap/chat, subject loader, auth modal, verify-email) — user just can't *see* it yet because login is blocked.
> Remaining: actual login unblock is a Supabase setting (needs user / authorized admin call); optional deeper mind-map + flashcard visual treatment; backend hardening (RLS / regenerate `schema.sql`).

**Update (same day) — servers durable, formula rendering, batch forge:**
- **Backend durability:** the session-tied background uvicorn kept getting reaped → "Failed to fetch" on forge. Relaunched as a **detached OS process** (`Start-Process`, survives session reaping). `start_backend.bat` already exists for the user to run it independently of Claude.
- **User-delete FK:** diagnosed "Database error deleting user" as missing `ON DELETE CASCADE` on `profiles→auth.users` (+ downstream subjects/focus_sessions); gave the user the ALTER SQL (live-DB change is theirs).
- **Formula rendering (root cause):** the Deep-Forge prompt emitted single-backslash LaTeX inside JSON → `json_validate_failed` or `\t`/`\f` mangling → "raw"-looking formulas. Fixed `groq_generator.py` to require **double-escaped backslashes**, real LaTeX commands, and NO prose inside `$…$`. Made every render site lenient + math-enabled: reader, flashcard **front+back**, and **chat tutor** (added `remarkMath`+`rehypeKatex`+katex CSS) — all with `{ throwOnError:false, strict:false }`. Old forges still hold pre-fix data; re-forge to see clean math.
- **Batch forge:** added `backend/forge_files.py` — logs in as the user (username→email via service role, then password grant) and forges the 6 PDFs in `study materials/` as **AI, NLP, NLP Notes, ML, DL, AI Core**, sequentially (respects Groq free-tier rate limit). Running in background. (Token-expiry bug later fixed — refreshes the access token per file.)

**Update (same day) — Gemini + Groq LLM cascade:**
- Added `backend/services/llm_client.py` — `complete(system, user, json_mode)` runs a provider cascade **Gemini 2.5-flash → Groq llama-3.3-70b → Groq llama-3.1-8b**, with auto-failover on error / 429 / invalid-JSON, and skips any provider whose key isn't in `.env`. Gemini via REST + `responseMimeType: application/json` + `thinkingBudget: 0`.
- Routed `groq_generator.py` (knowledge graph + mind map) and `routes/chat.py` through the cascade (replaced the direct Groq 8B calls).
- `GEMINI_API_KEY` stored in `backend/.env` (gitignored). Note: this project's free tier has `gemini-2.0-flash` **quota-blocked** (429) but `gemini-2.5-flash` works → set as primary.
- Verified end-to-end: `[llm] gemini:gemini-2.5-flash OK` returning clean LaTeX (`$S_n = \\frac{n(n+1)}{2}$`, proper escaping, formula-only). Re-forging all 6 study materials on the cascade.

**Update (same day) — forge speed + Unicode fix + password-reset flow (deploy-prep phase 1-2):**
- **Trim:** per-chunk politeness sleep in `groq_generator.py` cut 3s → 1s (cascade absorbs bursts/429s).
- **Unicode crash fix:** a `≤` char crashed AI Core's forge via Windows cp1252. Relaunched backend with `PYTHONUTF8=1` and added `set PYTHONUTF8=1` to `start_backend.bat`. Re-forge result: **5/6 clean (AI, NLP, NLP Notes, ML, DL)**; AI Core re-forging after the fix. (Old pre-fix duplicates remain in the library — newest = clean.)
- **Forgot-password / reset flow built** (emails deliver once Brevo SMTP is configured post-deploy):
  - `app/auth/callback/route.ts` — exchanges PKCE `code` for a session, forwards to `?next`.
  - `app/reset-password/page.tsx` — editorial new-password form (recovery session / expired-link / success states).
  - `auth-modal.tsx` — new `forgot` mode + "Forgot?" link → `resetPasswordForEmail(redirectTo=/auth/callback?next=/reset-password)`.
  - Verified: `/`, `/reset-password` → 200; `/auth/callback` → 307; no console errors.
- `forge_files.py` now takes a CLI filter (`python forge_files.py "AI Core"`) + refreshes its token per file.

---

## 2026-06-13 — Full UI remodel kickoff + backend fixes

### Decisions / setup
- Direction confirmed with user: **stay on Next.js 16** (not Astro); build the modern remodel **on top of the current uncommitted V3 frontend** (no revert, no auto-commit/push); **phased, landing-page first**.
- Installed frontend 3D/animation stack (60 pkgs, exit 0): `three@0.184`, `@react-three/fiber@9.6`, `@react-three/drei@10.7`, `@react-three/postprocessing@3.0`, `@react-three/rapier@2.2`, `gsap@3.15`, `lenis@1.3`, `postprocessing@6.39`, `three-stdlib@2.36`. (Harmless EBADENGINE warnings: some transitive tooling prefers Node ≥22; we run 20.11.)
- Installed backend `python-docx@1.2` (+ lxml) for real DOCX parsing.

### Backend fixes
- **DOCX ingestion (was broken):** added `backend/parsers/document_parser.py` — PDF (PyMuPDF) + DOCX (python-docx, incl. table cells) extractors plus an extension dispatcher `extract_text_from_document(bytes, filename)`. Rewired `backend/services/pipeline.py` to use it. Previously *all* uploads were forced through `fitz.open(..., filetype="pdf")`, so every `.docx` (which the UI advertises) failed.
- **`/login` 404:** unauthenticated users were redirected to a non-existent `/login`. Changed to `/` (where the auth modal lives) in `frontend/src/utils/supabase/middleware.ts`, `frontend/src/app/dashboard/page.tsx`, `frontend/src/app/subject/[id]/page.tsx`.

### Notes / observations
- ⚠️ Antigravity appears to be editing frontend files concurrently (dashboard `page.tsx` changed mid-edit). Concurrent edits will collide — agreed to let Claude own the frontend during the remodel.

### Custom cursor (done)
- Added `frontend/src/components/custom-cursor.tsx` — ported the user's `#cursor-dot` spec to a React client component, with added **lerp-trail smoothing** and **theme-aware colors** (uses `var(--primary)` + `color-mix`, so it adapts to light/dark). Touch-device fallback, hover-ring over interactive elements, shrink-on-click.
- Added cursor + Lenis CSS to `frontend/src/app/globals.css`.
- Mounted `<CustomCursor />` globally in `frontend/src/app/layout.tsx`.

### Smooth scroll (done)
- Added `frontend/src/components/smooth-scroll.tsx` — Lenis synced to the GSAP ticker + `ScrollTrigger.update` (nested scrollers can opt out via `data-lenis-prevent`). Currently wraps the landing page only (kept off the app/workspace for now to avoid hijacking internal scroll panels).

### 3D / shader landing hero (done — phase 1)
- Added `frontend/src/components/three/forge-scene.tsx` — a **custom GLSL nebula backdrop** (fbm value-noise, cyan→indigo) + a distorted "knowledge core" (`Icosahedron` + drei `MeshDistortMaterial`), `Float`, `Sparkles`, pointer parallax, two-point cyan/indigo lighting.
- Added `frontend/src/components/three/hero-canvas.tsx` — R3F `Canvas` + `EffectComposer`/`Bloom` postprocessing, client-only.
- Wired into `frontend/src/app/page.tsx`: dynamic import (`ssr:false`) of `HeroCanvas` as a full-bleed hero backdrop behind the existing interactive playground; wrapped the page in `<SmoothScroll>`.

### Verification
- `npm install` of 3D stack: exit 0. Dev server compiles; `GET / 200`. Browser console after hydration: only React-devtools info + `[HMR] connected`, **no errors**. (Headless screenshot tool times out on the always-animating canvas — verified via SSR + console instead.)
- Preview dev server now runs on **http://localhost:3000** (managed by the preview tool; Next 16 only allows one dev server per dir, so the manual :3085 one was stopped). Backend on :8085, CORS already allows :3000.

### Rapier physics showcase (done — landing)
- Added `frontend/src/components/three/forge-showcase.tsx` — an interactive **Rapier** rigid-body scene: 12 branded "knowledge shards" (cyan/sky/indigo/violet + gold) falling in a bounded box, with an invisible **kinematic pointer body** that follows the cursor and scatters them. Bloom postprocessing, two-point lighting.
- Added `frontend/src/components/reveal.tsx` — reusable **GSAP ScrollTrigger** fade/rise reveal wrapper.
- Inserted a new "Knowledge, forged from chaos" section into `frontend/src/app/page.tsx` (between Features and Quick Tools) using `<ForgeShowcase>` (dynamic, ssr:false) + `<Reveal>`.
- Verified (preview browser, port 3000): Fast Refresh OK, three.js + Rapier wasm both initialize, **no console errors**. (HTTP 200, 90KB.)

### Not yet done (remaining landing polish, then later phases)
- More GSAP ScrollTrigger choreography (hero parallax on scroll, staggered section reveals beyond the physics block) + a cohesion restyle pass on features/tools/FAQ.
- **Draco**: installed but not yet exercised — needs a real `.glb` asset; will wire `useGLTF` + DRACOLoader when a model is added.
- Phase 2+: remodel dashboard, workspace/reader, mind-map, flashcards, auth.
- Backend hardening still open: real RLS policies as a migration + regenerate stale `schema.sql` (Supabase MCP disconnected this session, so not applied).
