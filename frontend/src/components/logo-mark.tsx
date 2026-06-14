/**
 * StudyForge mark — an ember "press seal" with a negative-space spark.
 * Pure SVG, theme-aware (uses currentColor-ish via Tailwind fills). No hooks,
 * so it's usable in both server and client components.
 */
export function LogoMark({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="30" height="30" rx="9" className="fill-primary" />
      {/* 4-point spark in negative space */}
      <path
        d="M16 5.5 C 16.9 11.6, 20.4 15.1, 26.5 16 C 20.4 16.9, 16.9 20.4, 16 26.5 C 15.1 20.4, 11.6 16.9, 5.5 16 C 11.6 15.1, 15.1 11.6, 16 5.5 Z"
        className="fill-primary-foreground"
      />
    </svg>
  )
}

/** Full lockup: mark + editorial serif wordmark. */
export function Logo({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark size={size} />
      <span className="font-heading text-[1.35rem] leading-none tracking-tight text-foreground">
        Study<span className="italic text-primary">forge</span>
      </span>
    </span>
  )
}
