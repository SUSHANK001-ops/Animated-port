'use client'
import React from 'react'
import { useGsapReveal } from './useGsapReveal'

interface SectionHeaderProps {
  /** The label shown inside curly braces, e.g. "WHAT I DO". */
  label: string
  /** Optional larger title rendered below the braced label. */
  title?: string
  className?: string
}

/**
 * nbnzia-style section header: { LABEL } with braces in accent green,
 * monospace font, followed by an optional bold title.
 */
const SectionHeader = ({ label, title, className = '' }: SectionHeaderProps) => {
  const ref = useGsapReveal<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      <p className="font-mono text-sm md:text-base tracking-widest text-muted">
        <span className="text-accent">{'{ '}</span>
        {label.toUpperCase()}
        <span className="text-accent">{' }'}</span>
      </p>
      {title && (
        <h2 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
      )}
    </div>
  )
}

export default SectionHeader
