'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { identity, nepaliQuote, socials } from '@/data/config'
import { useGsapReveal } from './useGsapReveal'

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Contact', href: '/contact' },
]

const Footer = () => {
  const ctaRef = useGsapReveal<HTMLDivElement>()

  return (
    <footer className="border-t border-border bg-background">
      {/* CTA */}
      <div ref={ctaRef} className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <h2 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl">
          LET&apos;S BUILD
          <br />
          SOMETHING.
        </h2>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition-transform duration-300 hover:scale-[1.02]"
        >
          Get in Touch
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="font-mono text-xs text-muted">
            &copy; {new Date().getFullYear()} {identity.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Nepali quote */}
        <div className="mx-auto max-w-7xl px-6 pb-8 md:px-10">
          <p className="font-devanagari text-sm text-foreground/70">{nepaliQuote.text}</p>
          <p className="font-mono text-xs text-muted">{nepaliQuote.translation}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
