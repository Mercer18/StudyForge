"use client"

import { useEffect } from "react"

/**
 * Bespoke StudyForge cursor: a small theme-colored dot that lerp-trails the
 * pointer, expands into a translucent ring over interactive elements, and
 * shrinks on click. Falls back to the native cursor on touch / coarse pointers.
 */
const HOVER_SELECTORS =
  'a, button, [role="button"], .btn, [data-cursor="hover"], summary, .key-badge'

export function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return
    // Respect non-mouse devices entirely
    if (!window.matchMedia("(pointer: fine)").matches) return

    const dot = document.getElementById("cursor-dot")
    if (!dot) return
    const body = document.body

    let targetX = -999
    let targetY = -999
    let renderX = -999
    let renderY = -999
    let initialized = false
    let isTouch = false
    let lastTouch = 0
    let raf = 0

    const ignoreMouse = () => isTouch || Date.now() - lastTouch < 500

    const onTouch = () => {
      isTouch = true
      lastTouch = Date.now()
      body.classList.remove("cursor-ready", "custom-cursor-active")
      dot.style.display = "none"
    }

    const onMove = (e: MouseEvent) => {
      if (Date.now() - lastTouch < 500) return
      if (Number.isNaN(e.clientX) || Number.isNaN(e.clientY)) return
      if (isTouch) {
        isTouch = false
        dot.style.display = "block"
      }
      targetX = e.clientX
      targetY = e.clientY
      if (!initialized) {
        // Snap to first position so the dot doesn't fly in from the corner
        renderX = targetX
        renderY = targetY
        initialized = true
      }
      body.classList.add("cursor-ready", "custom-cursor-active")
    }

    const onLeaveWindow = () =>
      body.classList.remove("cursor-ready", "custom-cursor-active")

    const onDown = (e: MouseEvent) => {
      if (ignoreMouse()) return
      targetX = e.clientX
      targetY = e.clientY
      body.classList.add("cursor-down")
    }
    const onUp = () => {
      if (ignoreMouse()) return
      body.classList.remove("cursor-down")
    }

    const onOver = (e: MouseEvent) => {
      if (ignoreMouse()) return
      const t = e.target as Element | null
      if (t && t.closest && t.closest(HOVER_SELECTORS)) {
        body.classList.add("cursor-hover")
      }
    }
    const onOut = (e: MouseEvent) => {
      if (ignoreMouse()) return
      const t = e.target as Element | null
      if (t && t.closest && t.closest(HOVER_SELECTORS)) {
        body.classList.remove("cursor-hover")
      }
    }

    const tick = () => {
      if (initialized && !ignoreMouse()) {
        // Smooth trailing motion (GPU-accelerated translate3d)
        renderX += (targetX - renderX) * 0.2
        renderY += (targetY - renderY) * 0.2
        dot.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate3d(-50%, -50%, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener("touchstart", onTouch, { passive: true })
    window.addEventListener("touchmove", onTouch, { passive: true })
    window.addEventListener("touchend", onTouch, { passive: true })
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseenter", onMove)
    window.addEventListener("mouseleave", onLeaveWindow)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("mouseover", onOver)
    window.addEventListener("mouseout", onOut)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("touchstart", onTouch)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("touchend", onTouch)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseenter", onMove)
      window.removeEventListener("mouseleave", onLeaveWindow)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("mouseover", onOver)
      window.removeEventListener("mouseout", onOut)
      body.classList.remove(
        "cursor-ready",
        "custom-cursor-active",
        "cursor-hover",
        "cursor-down"
      )
    }
  }, [])

  return <div id="cursor-dot" aria-hidden="true" />
}
