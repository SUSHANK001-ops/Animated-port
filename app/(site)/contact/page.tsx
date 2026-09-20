import React from 'react'
import type { Metadata } from 'next'
import { identity, socials } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact · Sushanka Lamichhane',
  description: 'Get in touch for projects, collaboration, or remote work.',
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-40">
      <SectionHeader label="Say Hello" title="Contact" className="mb-14" />

      <div className="grid grid-cols-1 gap-10 pb-24 lg:grid-cols-[1fr_320px] lg:gap-16">
        <ContactForm />

        {/* Side info */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Email</p>
            <a
              href={`mailto:${identity.email}`}
              className="mt-2 block text-sm text-foreground transition-colors hover:text-accent"
            >
              {identity.email}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Location</p>
            <p className="mt-2 text-sm text-foreground">
              {identity.location} {identity.locationFlag}
            </p>
            <p className="mt-1 text-xs text-muted">Available for remote work worldwide</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Connect</p>
            <div className="mt-3 flex flex-col gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
