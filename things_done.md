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

> Remaining: `verify-email` page polish; deeper mind-map/flashcard visual treatment if desired; backend hardening (RLS / regenerate `schema.sql`) still open.

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
