'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { identity, nepaliQuote, socials } from '@/data/config'
import { useGsapReveal } from './useGsapReveal'
import FlowerField from './delight/FlowerField'
import NptClock from './delight/NptClock'

const pageLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const Footer = () => {
  const ctaRef = useGsapReveal<HTMLDivElement>()

  return (
    <footer className="relative border-t border-border bg-surface">
      {/* CTA */}
      <div ref={ctaRef} className="editorial-wide pt-20 pb-14 text-center">
        <p className="eyebrow mb-4">Say hello</p>
        <h2 className="text-4xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-5xl">
          Let&apos;s build{' '}
          <span className="marker-underline">something good.</span>
        </h2>
        <Link
          href="/contact"
          data-click-sound
          className="pop-btn group mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background"
        >
          Get in touch
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Link columns */}
      <div className="editorial-wide border-t border-border py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="eyebrow mb-3">Pages</p>
            <ul className="space-y-2">
              {pageLinks.slice(0, 4).map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">More</p>
            <ul className="space-y-2">
              {pageLinks.slice(4).map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Elsewhere</p>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Now</p>
            <NptClock variant="inline" className="mb-2" />
            <p className="font-devanagari text-sm text-foreground/70">{nepaliQuote.text}</p>
            <p className="mt-1 text-xs text-muted">{nepaliQuote.translation}</p>
          </div>
        </div>

        <p className="mt-10 font-mono text-xs text-muted">
          &copy; {new Date().getFullYear()} {identity.name}. Built with care in Nepal.
        </p>
      </div>

      {/* Floating flowers */}
      <FlowerField />
    </footer>
  )
}

export default Footer
