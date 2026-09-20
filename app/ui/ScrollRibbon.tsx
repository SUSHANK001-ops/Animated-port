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
 * While pinned, the text sweeps along the arc driven by scroll progress,
 * entering from the right and exiting left.
 *
 * DOM-safety: ScrollTrigger's `pin` inserts a "pin-spacer" wrapper into the
 * DOM. If React unmounts the component (route change) while that spacer is
 * still there, React's own removeChild throws. To avoid that we:
 *   - pin an INNER element (not the React-owned outer section),
 *   - use pinType 'transform' (no spacer style surgery on scroll),
 *   - explicitly kill the ScrollTrigger in cleanup BEFORE React unmounts.
 */
const ScrollRibbon = ({
  text,
  outline = false,
  pinMultiplier = 1.4,
  fontSize = 70,
  className = '',
}: ScrollRibbonProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const textPathRef = useRef<SVGTextPathElement>(null)
  const [ready, setReady] = useState(false)

  const rawId = useId().replace(/[:]/g, '')
  const pathId = `ribbon-arc-${rawId}`

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const path = pathRef.current
    const tp = textPathRef.current
    if (!section || !pin || !path || !tp) return

    let killed = false
    let trigger: ScrollTrigger | null = null
    let anim: gsap.core.Tween | null = null

    const init = () => {
      if (killed) return
      const pathLen = path.getTotalLength()
      const textLen = tp.getComputedTextLength()
      if (!pathLen || !textLen) {
        requestAnimationFrame(init)
        return
      }

      const margin = pathLen * 0.12
      const startOffset = pathLen - margin
      const endOffset = -textLen + margin

      gsap.set(tp, { attr: { startOffset } })
      setReady(true)

      anim = gsap.to(tp, {
        attr: { startOffset: endOffset },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * pinMultiplier)}`,
          pin: pin,
          pinType: 'transform',
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      trigger = anim.scrollTrigger ?? null

      ScrollTrigger.refresh()
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(init))
    } else {
      requestAnimationFrame(init)
    }

    return () => {
      killed = true
      // Kill trigger first (removes pin, restores DOM) BEFORE React unmounts.
      trigger?.kill()
      anim?.kill()
    }
  }, [pinMultiplier, text])

  return (
    <div
      ref={sectionRef}
      className={`relative h-screen overflow-hidden ${className}`}
      aria-label={text}
    >
      <div
        ref={pinRef}
        className="flex h-screen items-center justify-center"
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
    </div>
  )
}

export default ScrollRibbon
