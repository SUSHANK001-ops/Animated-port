'use client'
import React, { useRef } from 'react'
import Link from 'next/link'

interface MagneticProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  external?: boolean
  /** How strongly it follows the cursor (px offset multiplier). */
  strength?: number
  ariaLabel?: string
}

/**
 * A button/link that gently pulls toward the cursor while hovered, then
 * springs back. Falls back to a normal element when reduced motion is on.
 */
export default function MagneticButton({
  href,
  onClick,
  children,
  className = '',
  external = false,
  strength = 0.35,
  ariaLabel,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  const inner = (
    <span
      ref={ref}
      className="inline-flex items-center"
      style={{ transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {children}
    </span>
  )

  const shared = {
    className: `pop-btn ${className}`,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    'aria-label': ariaLabel,
    'data-click-sound': true as const,
  }

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
          {inner}
        </a>
      )
    }
    return (
      <Link href={href} {...shared}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} {...shared}>
      {inner}
    </button>
  )
}
