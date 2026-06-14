"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  BookOpen,
  Layers,
  Workflow,
  MessageSquareText,
  Timer,
  FileText,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { AuthModal } from "@/components/auth-modal"
import { Logo } from "@/components/logo-mark"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Reveal } from "@/components/reveal"
import { HeroBackdrop } from "@/components/hero-backdrop"

const INGEST = ["Textbooks", "Lecture PDFs", "YouTube lectures", "DOCX notes", "Scanned chapters", "Slide decks"]

const STEPS = [
  {
    n: "01",
    title: "Drop it in",
    body: "Upload a PDF or DOCX, or paste a YouTube link. We pull every usable word — paragraphs, tables, captions — not just the easy bits.",
  },
  {
    n: "02",
    title: "We press it",
    body: "Semantic chunking feeds a map-reduce pass over Llama-3. Out comes a structured knowledge graph: clean notes, key concepts, diagrams, and recall cards.",
  },
  {
    n: "03",
    title: "You study sharp",
    body: "Read the workspace, flip the deck, walk the mind map, and ask the tutor — which answers only from your material, never from thin air.",
  },
]

const FEATURES = [
  { kicker: "Reader", icon: BookOpen, title: "A workspace, not a wall of text", body: "Sources become legible sections with concept tags, LaTeX math, and Mermaid diagrams rendered inline." },
  { kicker: "Recall", icon: Layers, title: "Decks that fight forgetting", body: "Auto-built active-recall cards with a tactile 3D flip and full keyboard control — space to flip, arrows to move." },
  { kicker: "Structure", icon: Workflow, title: "The whole syllabus, mapped", body: "A multi-unit mind map lays out how every topic connects, with cross-cutting concepts pulled to the surface." },
  { kicker: "Tutor", icon: MessageSquareText, title: "A tutor on a leash", body: "Vector RAG over your document means the chat answers from your pages — and admits when something isn't there." },
  { kicker: "Focus", icon: Timer, title: "Deep-focus, measured", body: "A full-screen Pomodoro console tracks real time-on-task per workspace, so streaks reflect actual work." },
  { kicker: "Ingest", icon: FileText, title: "Whatever you've got", body: "PDF, DOCX, and YouTube today — parsed robustly, with graceful failure when a source has no readable text." },
]

const FAQS = [
  { q: "What can I feed it?", a: "Academic PDFs, Word DOCX files, and public YouTube lectures. Text and tables are extracted; image-only scans without OCR are politely rejected." },
  { q: "How does the tutor avoid making things up?", a: "Your document is chunked and embedded into a vector store. Each question retrieves only the most relevant passages, and the model is instructed to answer strictly from them." },
  { q: "Is my study time actually tracked?", a: "The focus timer logs real seconds-on-task per workspace in your browser, mapped to each subject — no inflated dashboards." },
  { q: "Do I need an account?", a: "Yes — a free account gives you a private library where you can forge, rename, and revisit workspaces from any device." },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Subtle ember glow that follows the pointer in the hero
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`)
      document.documentElement.style.setProperty("--y", `${e.clientY}px`)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
        <Navbar />

        {/* ===================== HERO ===================== */}
        <section className="relative isolate">
          <HeroBackdrop />
          <div className="pointer-events-none absolute inset-0 ambient-glow opacity-70" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-36 sm:pt-48 pb-20 lg:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                AI study workspace
              </div>

              <h1 className="font-heading font-light text-foreground tracking-tight text-[3.4rem] sm:text-7xl lg:text-[5.6rem] leading-[0.95]">
                Raw material in,
                <br />
                <span className="italic text-primary">understanding</span> out.
              </h1>

              <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                StudyForge presses textbooks, PDFs, and lectures into clean study
                workspaces — structured notes, a syllabus mind map, recall decks, and a
                tutor that only knows your material.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <AuthModal initialTab="signup">
                  <button className="group inline-flex items-center gap-2.5 rounded-full bg-primary text-primary-foreground pl-6 pr-5 py-3.5 font-mono text-xs uppercase tracking-[0.16em] font-medium hover:opacity-90 transition-all cursor-pointer">
                    Start forging — free
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </AuthModal>
                <a
                  href="#method"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-foreground hover:bg-muted transition-colors"
                >
                  See the method
                </a>
              </div>
            </motion.div>
          </div>

          {/* Ingest marquee */}
          <div className="relative z-10 rule border-b bg-background/40 backdrop-blur-sm">
            <div className="overflow-hidden py-5 marquee-mask">
              <div className="flex w-max animate-infinite-scroll">
                {[...INGEST, ...INGEST, ...INGEST].map((item, i) => (
                  <span key={i} className="flex items-center gap-5 px-5 font-heading text-2xl sm:text-3xl text-muted-foreground/70">
                    {item}
                    <span className="text-primary text-lg">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== METHOD ===================== */}
        <section id="method" className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 scroll-mt-20">
          <Reveal className="max-w-2xl mb-16">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">The method</span>
            <h2 className="mt-4 font-heading font-light text-4xl sm:text-5xl tracking-tight leading-[1.05]">
              Three moves from <span className="italic">pile</span> to <span className="italic text-primary">mastery</span>.
            </h2>
          </Reveal>

          <div className="border-t border-border">
            {STEPS.map((s) => (
              <Reveal key={s.n}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-border group">
                  <div className="md:col-span-2 font-heading text-5xl sm:text-6xl text-primary/90 leading-none">{s.n}</div>
                  <h3 className="md:col-span-4 font-heading text-2xl sm:text-3xl tracking-tight">{s.title}</h3>
                  <p className="md:col-span-6 text-muted-foreground leading-relaxed max-w-xl md:pt-1.5">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===================== FEATURES ===================== */}
        <section id="features" className="mx-auto max-w-7xl px-5 sm:px-8 py-24 sm:py-32 scroll-mt-20">
          <Reveal className="max-w-2xl mb-16">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">What you get</span>
            <h2 className="mt-4 font-heading font-light text-4xl sm:text-5xl tracking-tight leading-[1.05]">
              Built for the part that&apos;s actually hard — <span className="italic">learning it</span>.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {FEATURES.map((f) => (
              <Reveal key={f.title} className="bg-card">
                <div className="h-full p-8 flex flex-col gap-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <f.icon className="w-5 h-5 text-primary" strokeWidth={1.6} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{f.kicker}</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl tracking-tight leading-snug mt-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section id="faq" className="mx-auto max-w-3xl px-5 sm:px-8 py-24 sm:py-32 scroll-mt-20">
          <Reveal className="mb-12 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Questions</span>
            <h2 className="mt-4 font-heading font-light text-4xl sm:text-5xl tracking-tight">Straight answers</h2>
          </Reveal>

          <div className="border-t border-border">
            {FAQS.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer group"
                  >
                    <span className="font-heading text-lg sm:text-xl tracking-tight group-hover:text-primary transition-colors">{item.q}</span>
                    {open ? <Minus className="w-5 h-5 text-primary shrink-0" /> : <Plus className="w-5 h-5 text-muted-foreground shrink-0" />}
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground leading-relaxed max-w-2xl">{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ===================== CLOSING CTA ===================== */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 sm:pb-32">
          <Reveal>
            <div className="relative rounded-[2rem] bg-primary text-primary-foreground overflow-hidden px-8 sm:px-16 py-20 sm:py-28 text-center">
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_55%)]" />
              <h2 className="relative font-heading font-light text-4xl sm:text-6xl tracking-tight leading-[1.02]">
                Stop re-reading.
                <br />
                Start <span className="italic">forging</span>.
              </h2>
              <p className="relative mt-6 max-w-md mx-auto text-primary-foreground/80 leading-relaxed">
                Your next study session could start from a clean, structured workspace instead of a 300-page PDF.
              </p>
              <AuthModal initialTab="signup">
                <button className="relative mt-10 inline-flex items-center gap-2.5 rounded-full bg-background text-foreground pl-6 pr-5 py-3.5 font-mono text-xs uppercase tracking-[0.16em] font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  Create your forge
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </AuthModal>
            </div>
          </Reveal>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="border-t border-border">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo size={24} />
            <p className="font-mono text-[11px] text-muted-foreground tracking-wide text-center">
              Built by <span className="text-foreground">Rishi</span> · © {new Date().getFullYear()} StudyForge
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="key-badge">Vector RAG</span>
              <span className="key-badge">Llama-3</span>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}
