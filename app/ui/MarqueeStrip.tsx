import React from 'react'

interface MarqueeStripProps {
  items: string[]
  /** Seconds for one full loop. Larger = slower. */
  duration?: number
  className?: string
}

/**
 * Infinite horizontal scrolling strip (nbnzia style).
 * Items are duplicated once so the CSS translateX(-50%) loop is seamless.
 * Pauses on hover.
 */
const MarqueeStrip = ({ items, duration = 32, className = '' }: MarqueeStripProps) => {
  const doubled = [...items, ...items]

  return (
    <div
      className={`marquee-paused w-full overflow-hidden border-y border-border bg-surface/40 ${className}`}
    >
      <div
        className="marquee py-4"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center" aria-hidden={i >= items.length}>
            <span className="px-6 font-mono text-sm md:text-base uppercase tracking-widest text-foreground/80">
              {item}
            </span>
            <span className="text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default MarqueeStrip
