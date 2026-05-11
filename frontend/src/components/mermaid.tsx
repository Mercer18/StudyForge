"use client"

import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

export function Mermaid({ chart }: { chart: string }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'var(--font-sans)',
    })

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(7)}`
        const { svg } = await mermaid.render(id, chart)
        setSvgContent(svg)
      } catch (error) {
        console.error('Mermaid rendering failed', error)
        setSvgContent('<div class="text-red-500 text-sm">Failed to render diagram</div>')
      }
    }

    if (chart) {
      renderChart()
    }
  }, [chart])

  return (
    <div 
      ref={chartRef} 
      className="flex justify-center items-center my-8 p-6 bg-card/30 rounded-xl border border-white/5 overflow-x-auto shadow-inner"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
