'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { identity, nepaliQuote, socials } from '@/data/config'
import { useGsapReveal } from './useGsapReveal'
import FlowerField from './delight/FlowerField'
import SpinBadge from './delight/SpinBadge'
import NptClock from './delight/NptClock'

// Four columns, laid out like manishtamang.com's footer.
const col1 = [
  { label: 'About', href: '/about' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Resume', href: identity.resume, external: true },
]
const col2 = [
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Home', href: '/' },
]
const col3 = [
  { label: 'Projects', href: '/projects' },
  { label: 'Photos', href: '/#life-lately' },
  { label: 'Services', href: '/#services' },
  { label: 'Experience', href: '/#experience' },
]

function FooterLink({
  label,
  href,
  external,
}: {
  label: string
  href: string
  external?: boolean
}) {
  const cls =
    'link-underline text-sm text-muted transition-colors hover:text-foreground'
  if (external || href.startsWith('http') || href.endsWith('.pdf')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  )
}

const Footer = () => {
  const ctaRef = useGsapReveal<HTMLDivElement>()

  return (
    <footer className="relative mt-24 border-t border-border bg-surface">
      {/* CTA */}
      <div ref={ctaRef} className="editorial-page pt-20 pb-14 text-center">
        <p className="eyebrow eyebrow-dot mb-4 justify-center">Say hello</p>
        <h2 className="display-serif text-4xl text-foreground md:text-5xl">
          Let&apos;s build{' '}
          <span className="display-serif-italic marker-underline">something good.</span>
        </h2>
        <Link
          href="/contact"
          data-click-sound
          className="pop-btn group mt-8 inline-flex items-center gap-2.5 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background"
        >
          Get in touch
          <ArrowRight size={16} className="arrow-slide" />
        </Link>
      </div>

      {/* Link columns */}
      <div className="editorial-page border-t border-border py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="eyebrow mb-3">Site</p>
            <ul className="space-y-2.5">
              {col1.map((l) => (
                <li key={l.label}>
                  <FooterLink {...l} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">More</p>
            <ul className="space-y-2.5">
              {col2.map((l) => (
                <li key={l.label}>
                  <FooterLink {...l} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Work</p>
            <ul className="space-y-2.5">
              {col3.map((l) => (
                <li key={l.label}>
                  <FooterLink {...l} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Elsewhere</p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <FooterLink label={s.label} href={s.url} external />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Name + year (left) · local time (right) */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted">
            &copy; {new Date().getFullYear()} {identity.name}
          </p>
          <div className="flex items-center gap-4">
            <p className="font-devanagari text-xs text-foreground/60">
              {nepaliQuote.text}
            </p>
            <NptClock variant="inline" />
          </div>
        </div>
      </div>

      {/* Floating flowers + spinning badge */}
      <div className="relative">
        <FlowerField />
        <div className="pointer-events-auto absolute bottom-3 right-5 z-10 hidden sm:block">
          <SpinBadge />
        </div>
      </div>
    </footer>
  )
}

export default Footer
