import React from 'react'
import type { Metadata } from 'next'
import { Send } from 'lucide-react'
import { identity } from '@/data/config'
import ContactForm from './ContactForm'
import LocalTimeNote from './LocalTimeNote'

export const metadata: Metadata = {
  title: 'Contact · Sushanka Lamichhane',
  description: 'Get in touch for projects, collaboration, or remote work.',
}

export default function ContactPage() {
  return (
    <div className="editorial-page pt-32 pb-16 md:pt-36">
      <p className="eyebrow eyebrow-dot mb-3">Say hello</p>
      <h1 className="display-serif text-4xl text-foreground md:text-5xl">
        Get in touch
      </h1>
      <p className="mt-4 max-w-xl text-[0.975rem] leading-relaxed text-muted">
        Have a project, a question, or just want to say hi? Verify your email and send a
        message — it lands straight in my inbox, and I&apos;ll get back to you as soon as I can.
      </p>
      <LocalTimeNote />

      {/* Single-column form card */}
      <div className="mt-12">
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="mb-6 flex items-center gap-2 text-muted">
            <Send size={15} />
            <span className="font-mono text-xs uppercase tracking-widest">Send a message</span>
          </div>
          <ContactForm />
        </div>

        {/* Direct email line */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted">You can also reach me directly at</p>
          <a
            href={`mailto:${identity.email}`}
            data-click-sound
            className="mt-1 inline-block text-[0.975rem] font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50"
          >
            {identity.email}
          </a>
        </div>
      </div>
    </div>
  )
}
