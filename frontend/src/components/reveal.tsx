"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Scroll-triggered reveal (fade + rise) driven by GSAP ScrollTrigger.
 * Wrap any block to have it animate in once as it enters the viewport.
 */
export function Reveal({
  children,
  y = 44,
  delay = 0,
  duration = 0.9,
  className,
}: {
  children: React.ReactNode
  y?: number
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        autoAlpha: 0,
        y,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [y, delay, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
