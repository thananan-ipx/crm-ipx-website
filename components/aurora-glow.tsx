import * as React from "react"

import { cn } from "@/lib/utils"

interface AuroraGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  glowClassName?: string
  /** Rounding of the glow halo. Match this to your child's roundness. */
  radiusClassName?: string
  /** Inset of the halo (e.g. "-inset-1", "-inset-[2px]"). */
  insetClassName?: string
  /** Disable the idle pulse animation. */
  noPulse?: boolean
}

export function AuroraGlow({
  className,
  glowClassName,
  radiusClassName = "rounded-2xl",
  insetClassName = "-inset-1",
  noPulse,
  children,
  ...props
}: AuroraGlowProps) {
  return (
    <div className={cn("group/aurora relative inline-flex", className)} {...props}>
      {/* Outer wide halo */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70 blur-xl transition-all duration-500",
          "group-hover/aurora:opacity-100 group-hover/aurora:blur-2xl",
          !noPulse && "animate-pulse",
          insetClassName,
          radiusClassName,
          glowClassName
        )}
      />
      {/* Counter-rotated overlay for aurora multi-hue */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bg-gradient-to-l from-cyan-400 via-emerald-400 to-amber-400 opacity-40 mix-blend-screen blur-xl transition-all duration-700",
          "group-hover/aurora:opacity-70",
          insetClassName,
          radiusClassName
        )}
      />
      {/* Tight inner glow */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute bg-gradient-to-r from-indigo-400/70 via-violet-400/70 to-pink-400/70 opacity-60 blur-md transition-all duration-500",
          "group-hover/aurora:opacity-90",
          insetClassName,
          radiusClassName
        )}
      />
      <span className="relative inline-flex">{children}</span>
    </div>
  )
}
