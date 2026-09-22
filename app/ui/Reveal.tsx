'use client'
import React, { useEffect, useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Delay in ms before this element reveals once in view. */
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}

/**
 * Lightweight IntersectionObserver reveal. Adds `.is-in` when the element
 * scrolls into view (CSS in globals handles the transition). Cheaper than a
 * GSAP ScrollTrigger for the many small blocks across the site.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t = window.setTimeout(() => el.classList.add('is-in'), delay)
            io.unobserve(el)
            return () => window.clearTimeout(t)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  const Comp = Tag as React.ElementType
  return (
    <Comp ref={ref} className={`reveal ${className}`}>
      {children}
    </Comp>
  )
}
