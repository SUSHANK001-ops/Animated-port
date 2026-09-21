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
  /** Font size (px) of the arc text. */
  fontSize?: number
  className?: string
}

/**
 * Scroll ribbon: text curves along a reverse-U (∩) arc and sweeps horizontally
 * as the section passes through the viewport.
 *
 * NON-PINNED by design: the section scrolls normally and the text's position
 * along the arc is mapped to scroll progress (scrub). This avoids ScrollTrigger
 * pin DOM surgery entirely — no pin-spacer, so no React removeChild crash on
 * route change and no layout overlap with neighbouring sections.
 */
const ScrollRibbon = ({
  text,
  outline = false,
  fontSize = 64,
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
    let trigger: ScrollTrigger | null = null

    const init = () => {
      if (killed) return
      const pathLen = path.getTotalLength()
      const textLen = tp.getComputedTextLength()
      if (!pathLen || !textLen) {
        requestAnimationFrame(init)
        return
      }

      // Text enters from the right and exits to the left as the section moves
      // from the bottom of the viewport to the top.
      const startOffset = pathLen
      const endOffset = -textLen

      const setter = gsap.quickSetter(tp, 'attr')
      gsap.set(tp, { attr: { startOffset } })
      setReady(true)

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const off = startOffset + (endOffset - startOffset) * self.progress
          setter({ startOffset: off })
        },
      })

      ScrollTrigger.refresh()
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(init))
    } else {
      requestAnimationFrame(init)
    }

    return () => {
      killed = true
      trigger?.kill()
    }
  }, [text])

  return (
    <div
      ref={sectionRef}
      className={`relative w-full overflow-hidden py-8 ${className}`}
      aria-label={text}
      style={{ visibility: ready ? 'visible' : 'hidden' }}
    >
      <svg
        viewBox="0 0 1000 240"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        {/* Reverse-U (∩) arc: low-left → peak center → low-right (shallow) */}
        <path ref={pathRef} id={pathId} d="M -20 230 Q 500 40 1020 230" fill="none" />
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
