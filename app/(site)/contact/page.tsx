import React from 'react'
import type { Metadata } from 'next'
import { Mail, MapPin, Github, Linkedin, Instagram, Send, ArrowUpRight } from 'lucide-react'
import { identity, socials } from '@/data/config'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact · Sushanka Lamichhane',
  description: 'Get in touch for projects, collaboration, or remote work.',
}

/** Map a social label to its icon. */
const socialIcon: Record<string, React.ElementType> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Email: Mail,
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
        message — it lands straight in my inbox.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Form card */}
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="mb-6 flex items-center gap-2 text-muted">
            <Send size={15} />
            <span className="font-mono text-xs uppercase tracking-widest">Send a message</span>
          </div>
          <ContactForm />
        </div>

        {/* Info sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Email */}
          <a
            href={`mailto:${identity.email}`}
            data-click-sound
            className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
              <Mail size={16} />
            </span>
            <div className="min-w-0">
              <p className="eyebrow mb-1">Email</p>
              <p className="truncate text-sm text-foreground transition-colors group-hover:text-accent">
                {identity.email}
              </p>
            </div>
          </a>

          {/* Location */}
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted">
              <MapPin size={16} />
            </span>
            <div>
              <p className="eyebrow mb-1">Location</p>
              <p className="text-sm text-foreground">
                {identity.location} {identity.locationFlag}
              </p>
              <p className="mt-1 text-xs text-muted">{identity.availability}</p>
            </div>
          </div>

          {/* Connect */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="eyebrow mb-3">Connect</p>
            <ul className="space-y-1">
              {socials.map((s) => {
                const Icon = socialIcon[s.label] ?? ArrowUpRight
                const external = !s.url.startsWith('mailto:')
                return (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      data-click-sound
                      className="group flex items-center justify-between rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={15} className="text-muted transition-colors group-hover:text-foreground" />
                        {s.label}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
