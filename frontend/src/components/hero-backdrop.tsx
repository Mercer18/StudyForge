/**
 * Theme-reactive hero atmosphere — pure CSS/SVG, no WebGL.
 * Everything is keyed off `var(--primary)` / `var(--foreground)` plus a few
 * `dark:` opacity tweaks, so it re-skins instantly when the light/dark toggle
 * flips. Ember glow + slow concentric "forge rings" + ember dot-grid + rising
 * sparks. Deterministic values (no Math.random) to stay hydration-safe.
 */

const SPARKS = [
  { left: "58%", size: 3, dur: "7.5s", delay: "0s" },
  { left: "66%", size: 2, dur: "9s", delay: "1.2s" },
  { left: "72%", size: 4, dur: "6.5s", delay: "2.4s" },
  { left: "80%", size: 2, dur: "10s", delay: "0.6s" },
  { left: "63%", size: 3, dur: "8s", delay: "3.1s" },
  { left: "86%", size: 2, dur: "7s", delay: "1.8s" },
  { left: "76%", size: 3, dur: "9.5s", delay: "4s" },
  { left: "69%", size: 2, dur: "8.5s", delay: "2.9s" },
]

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Focal ember glow (right) */}
      <div
        className="absolute top-[6%] right-[4%] h-[72vh] w-[72vh] rounded-full blur-[130px] opacity-20 dark:opacity-40"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 64%)" }}
      />
      {/* Cool counter-glow (bottom-left) for depth */}
      <div
        className="absolute -bottom-1/4 -left-[12%] h-[56vh] w-[56vh] rounded-full blur-[130px] opacity-[0.10] dark:opacity-25"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      {/* Ember dot-grid, faded toward the focal point */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage: "radial-gradient(circle at 72% 32%, black, transparent 72%)",
          maskImage: "radial-gradient(circle at 72% 32%, black, transparent 72%)",
        }}
      />

      {/* Concentric forge rings (a calm 2D echo of the old core) */}
      <svg
        className="absolute top-1/2 right-[1%] -translate-y-1/2 h-[140vh] w-[140vh] max-h-[920px] max-w-[920px] text-primary"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
      >
        <g style={{ transformOrigin: "300px 300px", animation: "hero-spin 100s linear infinite" }}>
          {[72, 132, 196, 262].map((r, i) => (
            <circle key={r} cx="300" cy="300" r={r} stroke="currentColor" strokeWidth="1" opacity={0.2 - i * 0.035} />
          ))}
          <circle cx="300" cy="300" r="226" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 13" opacity="0.35" />
        </g>
        <g style={{ transformOrigin: "300px 300px", animation: "hero-spin-rev 64s linear infinite" }}>
          <circle cx="300" cy="300" r="158" stroke="currentColor" strokeWidth="1" strokeDasharray="1 17" opacity="0.4" />
          <circle cx="300" cy="42" r="4" fill="currentColor" opacity="0.7" />
          <circle cx="300" cy="558" r="2.5" fill="currentColor" opacity="0.5" />
        </g>
        <circle
          cx="300"
          cy="300"
          r="298"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.07"
          style={{ transformOrigin: "300px 300px", animation: "hero-breathe 9s ease-in-out infinite" }}
        />
      </svg>

      {/* Rising embers */}
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="absolute bottom-[28%] rounded-full bg-primary"
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: 0,
            boxShadow: "0 0 6px 1px var(--primary)",
            animation: `ember-rise ${s.dur} ease-in ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Legibility fades top + bottom */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
