import React from 'react'
import type { Metadata } from 'next'
import { identity, socials } from '@/data/config'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact · Sushanka Lamichhane',
  description: 'Get in touch for projects, collaboration, or remote work.',
}

export default function ContactPage() {
  return (
    <div className="editorial-page pt-32 pb-24 md:pt-36">
      <p className="eyebrow eyebrow-dot mb-3">Say hello</p>
      <h1 className="display-serif text-4xl text-foreground md:text-5xl">
        Get in touch
      </h1>
      <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">
        Have a project, a question, or just want to say hi? Verify your email and send a
        message — it lands straight in my inbox.
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>

      <hr className="ed-divider" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <p className="eyebrow mb-2">Email</p>
          <a
            href={`mailto:${identity.email}`}
            data-click-sound
            className="text-sm text-foreground transition-colors hover:text-accent"
          >
            {identity.email}
          </a>
        </div>
        <div>
          <p className="eyebrow mb-2">Location</p>
          <p className="text-sm text-foreground">
            {identity.location} {identity.locationFlag}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-2">Connect</p>
          <div className="flex flex-col gap-1.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-click-sound
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
