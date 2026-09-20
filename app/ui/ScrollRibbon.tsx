'use client'
import React, { useEffect, useId, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRibbonProps {
  /** The phrase shown curving along the arc. */
  text: string
  /** Outlined text instead of filled. */
  outline?: boolean
  /**
   * Pin length as a multiple of viewport height. Larger = longer/slower sweep.
   */
  pinMultiplier?: number
  /** Font size (px) of the arc text. */
  fontSize?: number
  className?: string
}

/**
 * Pinned scroll ribbon: text curves along a reverse-U (∩) arc.
 *
 * While the section is pinned to the viewport, the text sweeps along the arc
 * driven by scroll progress. It starts centered on the arc peak and runs until
 * its end clears the left edge. Offsets are measured from the real path/text
 * length, recomputed after fonts load and on resize.
 */
const ScrollRibbon = ({
  text,
  outline = false,
  pinMultiplier = 1.4,
  fontSize = 70,
  className = '',
}: ScrollRibbonProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const [ready, setReady] = useState(false)

  const rawId = useId().replace(/[:]/g, '')
  const pathId = `ribbon-arc-${rawId}`

  useEffect(() => {
    const section = sectionRef.current
    const path = pathRef.current
    const tp = textPathRef.current
    if (!section || !path || !tp) return

    let killed = false

    const init = () => {
      if (killed) return
      const pathLen = path.getTotalLength()
      const textLen = tp.getComputedTextLength()
      if (!pathLen || !textLen) {
        // Layout not ready yet — retry next frame.
        requestAnimationFrame(init)
        return
      }

      // Overshoot kept small so the arc isn't empty for long at either end —
      // the text enters just off the right and exits just off the left, with
      // minimal dead gap. ~12% of the visible path on each side.
      const margin = pathLen * 0.12
      const startOffset = pathLen - margin
      const endOffset = -textLen + margin

      gsap.set(tp, { attr: { startOffset } })
      setReady(true)

      const anim = gsap.to(tp, {
        attr: { startOffset: endOffset },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * pinMultiplier)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      ScrollTrigger.refresh()
      return anim
    }

    // Wait for fonts so text measurement is accurate.
    const ctx = gsap.context(() => {
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => requestAnimationFrame(init))
      } else {
        requestAnimationFrame(init)
      }
    }, section)

    return () => {
      killed = true
      ctx.revert()
    }
  }, [pinMultiplier, text])

  return (
    <div
      ref={sectionRef}
      className={`relative flex h-screen items-center justify-center overflow-hidden ${className}`}
      aria-label={text}
      style={{ visibility: ready ? 'visible' : 'hidden' }}
    >
      <svg
        viewBox="0 0 1000 300"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        {/* Reverse-U (∩) arc: low-left → peak center → low-right */}
        <path ref={pathRef} id={pathId} d="M -40 320 Q 500 -40 1040 320" fill="none" />
        <text
          className={outline ? 'ribbon-arc-outline' : 'ribbon-arc-fill'}
          fontSize={fontSize}
          fontWeight="800"
        >
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset={0}>
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  )
}

export default ScrollRibbon
