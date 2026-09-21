'use client'
import React from 'react'
import { useGsapReveal } from './useGsapReveal'

/** Narrow centered reading column. */
export function Container({
  wide = false,
  className = '',
  children,
}: {
  wide?: boolean
  className?: string
  children: React.ReactNode
}) {
  return <div className={`${wide ? 'editorial-wide' : 'editorial'} ${className}`}>{children}</div>
}

/** Quiet uppercase eyebrow label. */
export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

/**
 * Calm block: eyebrow label + optional title, revealed gently on scroll.
 * Replaces the old bold curly-brace section header on the redesigned pages.
 */
export function Block({
  label,
  title,
  children,
  className = '',
}: {
  label?: string
  title?: string
  children?: React.ReactNode
  className?: string
}) {
  const ref = useGsapReveal<HTMLDivElement>({ y: 20 })
  return (
    <section ref={ref} className={className}>
      {label && <Eyebrow className="mb-3">{label}</Eyebrow>}
      {title && (
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

/** Editorial card wrapper. */
export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article'
}) {
  return <Tag className={`ed-card ${className}`}>{children}</Tag>
}
