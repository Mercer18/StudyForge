"use client"

import React from 'react'
import * as LucideIcons from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, HelpCircle } from 'lucide-react'

// Define the interface for our Mind Map data structure
interface Topic {
  title: string
  details: string[]
}

interface Column {
  id: number
  title: string
  color: string
  icon: string
  topics: Topic[]
}

interface CrossCuttingConcept {
  title: string
  details: string[]
}

interface MindMapData {
  title: string
  columns: Column[]
  cross_cutting: CrossCuttingConcept[]
}

// Safely map icon names to Lucide components
function resolveIcon(name: string) {
  if (!name) return HelpCircle
  
  // Convert kebab-case or snake_case to PascalCase
  const normalized = name
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const IconComponent = (LucideIcons as any)[normalized] || (LucideIcons as any)[name] || HelpCircle
  return IconComponent
}

// Visual premium color mapping system
const COLOR_THEMES: Record<string, {
  border: string
  bg: string
  text: string
  badge: string
  glow: string
  accent: string
  gradient: string
}> = {
  blue: {
    border: 'border-blue-200 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/40',
    bg: 'bg-blue-50/50 dark:bg-blue-500/[3%]',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.05)]',
    accent: 'bg-blue-500',
    gradient: 'from-blue-500/20 to-transparent'
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/40',
    bg: 'bg-emerald-50/50 dark:bg-emerald-500/[3%]',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.05)]',
    accent: 'bg-emerald-500',
    gradient: 'from-emerald-500/20 to-transparent'
  },
  purple: {
    border: 'border-purple-200 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/40',
    bg: 'bg-purple-50/50 dark:bg-purple-500/[3%]',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20',
    glow: 'shadow-[0_0_15px_rgba(139,92,246,0.05)]',
    accent: 'bg-purple-500',
    gradient: 'from-purple-500/20 to-transparent'
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-500/20 hover:border-amber-400 dark:hover:border-amber-500/40',
    bg: 'bg-amber-50/50 dark:bg-amber-500/[3%]',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.05)]',
    accent: 'bg-amber-500',
    gradient: 'from-amber-500/20 to-transparent'
  },
  teal: {
    border: 'border-teal-200 dark:border-teal-500/20 hover:border-teal-400 dark:hover:border-teal-500/40',
    bg: 'bg-teal-50/50 dark:bg-teal-500/[3%]',
    text: 'text-teal-600 dark:text-teal-400',
    badge: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/20',
    glow: 'shadow-[0_0_15px_rgba(20,184,166,0.05)]',
    accent: 'bg-teal-500',
    gradient: 'from-teal-500/20 to-transparent'
  },
  rose: {
    border: 'border-rose-200 dark:border-rose-500/20 hover:border-rose-400 dark:hover:border-rose-500/40',
    bg: 'bg-rose-50/50 dark:bg-rose-500/[3%]',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.05)]',
    accent: 'bg-rose-500',
    gradient: 'from-rose-500/20 to-transparent'
  },
  indigo: {
    border: 'border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500/40',
    bg: 'bg-indigo-50/50 dark:bg-indigo-500/[3%]',
    text: 'text-indigo-600 dark:text-indigo-400',
    badge: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.05)]',
    accent: 'bg-indigo-500',
    gradient: 'from-indigo-500/20 to-transparent'
  },
  cyan: {
    border: 'border-cyan-200 dark:border-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-500/40',
    bg: 'bg-cyan-50/50 dark:bg-cyan-500/[3%]',
    text: 'text-cyan-600 dark:text-cyan-400',
    badge: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.05)]',
    accent: 'bg-cyan-500',
    gradient: 'from-cyan-500/20 to-transparent'
  },
  pink: {
    border: 'border-pink-200 dark:border-pink-500/20 hover:border-pink-400 dark:hover:border-pink-500/40',
    bg: 'bg-pink-50/50 dark:bg-pink-500/[3%]',
    text: 'text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/20',
    glow: 'shadow-[0_0_15px_rgba(236,72,153,0.05)]',
    accent: 'bg-pink-500',
    gradient: 'from-pink-500/20 to-transparent'
  },
  violet: {
    border: 'border-violet-200 dark:border-violet-500/20 hover:border-violet-400 dark:hover:border-violet-500/40',
    bg: 'bg-violet-50/50 dark:bg-violet-500/[3%]',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20',
    glow: 'shadow-[0_0_15px_rgba(109,40,217,0.05)]',
    accent: 'bg-violet-500',
    gradient: 'from-violet-500/20 to-transparent'
  }
}

export function MindMap({ data }: { data: MindMapData | null }) {
  if (!data || !data.columns || data.columns.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-12 font-mono text-xs border border-dashed border-border rounded-lg bg-card/10 max-w-md mx-auto">
        Syllabus Map indexing in progress... Check back shortly.
      </div>
    )
  }

  return (
    <div className="w-full select-none font-sans overflow-x-auto py-4 px-2">
      <div className="min-w-[1200px] flex flex-col items-center">
        
        {/* ================= SUBJECT MAIN NODE ================= */}
        <div className="relative flex flex-col items-center">
          <div className="bg-card/45 border border-primary/20 backdrop-blur-md px-10 py-5 rounded-2xl shadow-xl flex flex-col items-center justify-center relative group hover:border-primary/40 hover:shadow-primary/5 transition-all duration-300 max-w-xl text-center">
            
            {/* Visual pulse glow on subject node */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-50 blur-sm pointer-events-none" />
            
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-mono text-[9px] uppercase font-bold tracking-[0.25em]">interactive syllabus</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading text-foreground uppercase">
              {data.title}
            </h1>
          </div>
          
          {/* Central Stem Line */}
          <div className="w-0.5 h-8 bg-border" />
        </div>

        {/* ================= CONNECTIVE STEM HORIZONTAL BAR ================= */}
        <div className="relative w-full h-0.5 bg-border flex items-center justify-between px-16">
          {data.columns.map((col, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div className="w-0.5 h-6 bg-border -mt-3" />
            </div>
          ))}
        </div>

        {/* ================= MULTI-COLUMN UNITS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-5 w-full mt-4 items-start px-2">
          {data.columns.map((col) => {
            const theme = COLOR_THEMES[col.color] || COLOR_THEMES.blue
            const Icon = resolveIcon(col.icon)
            
            return (
              <div key={col.id} className="flex flex-col gap-4 animate-in fade-in duration-300">
                
                {/* --- Unit Header Card --- */}
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.bg} ${theme.glow} flex flex-col gap-3 relative overflow-hidden group transition-all duration-300`}>
                  {/* Subtle top-light gradient line */}
                  <div className={`absolute top-0 left-0 w-full h-[3px] ${theme.accent}`} />
                  
                  <div className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${theme.badge}`}>
                      {col.id}
                    </span>
                    <Icon className={`w-4 h-4 shrink-0 ${theme.text}`} />
                  </div>
                  
                  <h3 className="font-heading font-extrabold text-[11px] tracking-wider uppercase leading-snug text-foreground">
                    {col.title}
                  </h3>
                </div>

                {/* Vertical connective dot line under header */}
                <div className="w-0.5 h-3 bg-border/40 mx-auto" />

                {/* --- Topic Cards Container --- */}
                <div className="flex flex-col gap-3.5">
                  {col.topics.map((topic, tIdx) => (
                    <div key={tIdx} className="flex flex-col">
                      <Card className="border border-border/80 bg-card/45 p-3 rounded-lg shadow-sm hover:border-primary/25 hover:shadow-md hover:bg-card/75 transition-all duration-300 group relative">
                        {/* Sub-node point connector */}
                        <div className={`absolute left-0 top-4 w-1.5 h-1.5 rounded-full -ml-[4px] shrink-0 border border-border bg-background group-hover:${theme.accent}`} />
                        
                        <CardContent className="p-0 pl-1.5 flex flex-col gap-2">
                          <h4 className="text-xs font-bold font-mono tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
                            {topic.title}
                          </h4>
                          
                          {topic.details && topic.details.length > 0 && (
                            <ul className="space-y-1.5 border-l border-border/40 pl-2">
                              {topic.details.map((detail, dIdx) => (
                                <li key={dIdx} className="text-[10px] text-muted-foreground/80 leading-relaxed font-sans relative pl-2">
                                  <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-muted-foreground/45" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                      
                      {tIdx < col.topics.length - 1 && (
                        <div className="w-0.5 h-3.5 bg-border/30 mx-auto" />
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )
          })}
        </div>

        {/* Connective Stem to bottom drawer */}
        <div className="w-0.5 h-8 bg-border/40 mt-10" />

        {/* ================= CROSS-CUTTING CONCEPTS TRAY ================= */}
        <div className="w-full max-w-6xl border border-border bg-card/35 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg relative overflow-hidden backdrop-blur-md">
          {/* Subtle side stripe */}
          <div className="absolute left-0 top-0 w-[4px] h-full bg-primary" />
          
          <div className="flex flex-col shrink-0 gap-1.5 text-center md:text-left select-none md:border-r md:border-border/60 md:pr-8 py-2 max-w-xs">
            <span className="font-mono text-[9px] uppercase font-bold tracking-[0.25em] text-primary">universal tools</span>
            <h3 className="font-heading font-black text-lg tracking-tight uppercase text-foreground leading-tight">
              Cross-Cutting Concepts
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Foundational paradigms, security rules, compliance, and deployment matrices across the curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 flex-1 w-full">
            {data.cross_cutting.map((concept, idx) => (
              <Card key={idx} className="border border-border/70 bg-card/50 p-3.5 rounded-xl hover:border-primary/20 hover:bg-card/85 shadow-sm transition-all duration-300">
                <CardContent className="p-0 flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold font-mono text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {concept.title}
                  </h4>
                  
                  {concept.details && concept.details.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {concept.details.map((detail, dIdx) => (
                        <span key={dIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border/80 bg-muted/30 text-muted-foreground/90 select-none">
                          {detail}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </div>
  )
}
