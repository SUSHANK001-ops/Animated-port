import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Github, Linkedin, Download, Mail } from 'lucide-react'
import { identity, techStack, socials, stats } from '@/data/config'
import SectionHeader from '../../ui/SectionHeader'
import StatBox from '../../ui/StatBox'
import MarqueeStrip from '../../ui/MarqueeStrip'

export const metadata: Metadata = {
  title: 'About · Sushanka Lamichhane',
  description: identity.heroTagline,
}

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-40">
        <SectionHeader label="Who I Am" title="About" className="mb-14" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
          {/* Profile column */}
          <div className="flex flex-col gap-6">
            <Image
              src={identity.profileImage}
              alt={identity.name}
              width={320}
              height={320}
              className="w-full max-w-[280px] rounded-2xl border border-border object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{identity.name}</h2>
              <p className="mt-1 font-mono text-sm text-accent">{identity.role}</p>
              <p className="mt-2 text-sm text-muted">
                {identity.location} {identity.locationFlag}
              </p>
              <p className="mt-1 font-mono text-xs text-muted">{identity.education}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {socials.map((s) => {
                const Icon =
                  s.label === 'GitHub'
                    ? Github
                    : s.label === 'LinkedIn'
                    ? Linkedin
                    : Mail
                if (s.label === 'Instagram') return null
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    <Icon size={14} /> {s.label}
                  </a>
                )
              })}
              <a
                href={identity.resume}
                download
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10"
              >
                <Download size={14} /> Resume
              </a>
            </div>
          </div>

          {/* Bio column */}
          <div className="space-y-6">
            {identity.bio.map((line, i) => (
              <p key={i} className="text-lg leading-relaxed text-foreground/85">
                {line}
              </p>
            ))}

            <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
              {stats.map((s) => (
                <StatBox key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <SectionHeader label="Toolbox" title="Tech Stack" className="mb-10" />
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm text-foreground/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <MarqueeStrip items={techStack} duration={40} />
      <div className="py-16" />
    </>
  )
}
