"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Layers } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { FlashcardView } from './flashcard'
import { MessageSquareText } from 'lucide-react'
import { ChatTutor } from './chat-tutor'
import { useParams } from 'next/navigation'
import { Mermaid } from './mermaid'

interface Section {
  id: string
  title: string
  content: string
  key_concepts: string[]
}

interface FlashcardData {
  id: string
  front: string
  back: string
}

interface StudyData {
  title: string
  overview: string
  sections: Section[]
  flashcards: FlashcardData[]
}

export function WorkspaceClient({ data, subjectTitle }: { data: StudyData | null, subjectTitle: string }) {
  const [activeTab, setActiveTab] = useState<'reader' | 'flashcards'>('reader')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(data?.sections?.[0]?.id || null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const params = useParams()
  const subjectId = params.id as string

  if (!data) return null

  const activeSection = data.sections.find(s => s.id === activeSectionId) || data.sections[0]

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
      {/* LEFT SIDEBAR */}
      <aside className="w-80 border-r bg-muted/10 flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xs font-bold text-primary mb-3 uppercase tracking-widest font-heading">AI Overview</h2>
          <p className="text-sm leading-7 text-muted-foreground">{data.overview}</p>
        </div>

        <div className="p-4 flex-1">
          <div className="flex space-x-2 mb-6 bg-muted/50 p-1 rounded-md">
            <button
              onClick={() => setActiveTab('reader')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded transition-colors ${
                activeTab === 'reader' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Reader
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded transition-colors ${
                activeTab === 'flashcards' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-4 w-4 mr-2" />
              Flashcards
            </button>
          </div>

          {activeTab === 'reader' && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold mb-3 px-2 text-muted-foreground">Table of Contents</h3>
              {data.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSectionId === section.id 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="px-2 text-sm text-muted-foreground">
              <p>Test your knowledge on {subjectTitle} with {data.flashcards.length} AI-generated flashcards.</p>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-background/50">
        <div className="max-w-3xl mx-auto p-8 lg:p-12">
          
          {activeTab === 'reader' && activeSection && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 space-y-5">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight">{activeSection.title}</h1>
                {activeSection.key_concepts && activeSection.key_concepts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeSection.key_concepts.map((concept, idx) => (
                      <Badge key={idx} variant="secondary" className="px-2.5 py-0.5 text-xs font-medium">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tailwind Typography Plugin Prose */}
              <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-8 prose-p:text-[1.05rem] prose-headings:font-heading prose-headings:tracking-tight text-left">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      if (!inline && match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />
                      }
                      return <code className={className} {...props}>{children}</code>
                    }
                  }}
                >
                  {activeSection.content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="animate-in fade-in duration-500 h-full flex flex-col items-center pt-10">
              <div className="w-full max-w-2xl text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Knowledge Check</h2>
                <p className="text-muted-foreground">Review the core concepts from the document.</p>
              </div>
              <FlashcardView flashcards={data.flashcards} />
            </div>
          )}

        </div>
      </main>

      {/* Floating Chat Button (when chat is closed) */}
      {!isChatOpen && (
        <Button 
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_0px_rgba(249,115,22,0.6)] hover:-translate-y-1 transition-all z-40 bg-primary"
        >
          <MessageSquareText className="w-6 h-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Tutor Sidebar */}
      {isChatOpen && (
        <ChatTutor subjectId={subjectId} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  )
}
