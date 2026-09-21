import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { identity, techStack, socials, stats } from '@/data/config'

export const metadata: Metadata = {
  title: 'About · Sushanka Lamichhane',
  description: identity.heroTagline,
}

export default function AboutPage() {
  return (
    <div className="editorial pt-32 pb-24 md:pt-40">
      <p className="eyebrow mb-3">About</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {identity.name}
      </h1>
      <p className="mt-1 font-mono text-sm text-accent">{identity.role}</p>

      <div className="mt-8 flex items-center gap-4">
        <Image
          src={identity.profileImage}
          alt={identity.name}
          width={72}
          height={72}
          className="h-18 w-18 rounded-full object-cover ring-1 ring-border"
        />
        <div className="text-sm text-muted">
          <p>
            {identity.location} {identity.locationFlag}
          </p>
          <p className="font-mono text-xs">{identity.education}</p>
        </div>
      </div>

      <div className="prose-calm mt-8 space-y-4">
        {identity.bio.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            data-click-sound
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            {s.label}
          </a>
        ))}
        <a
          href={identity.resume}
          download
          data-click-sound
          className="inline-flex items-center gap-1.5 text-sm text-accent transition-opacity hover:opacity-80"
        >
          <Download size={14} /> Résumé
        </a>
      </div>

      <hr className="ed-divider" />

      {/* Stats */}
      <p className="eyebrow mb-4">By the numbers</p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="eyebrow mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <hr className="ed-divider" />

      {/* Tech stack */}
      <p className="eyebrow mb-4">Toolbox</p>
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground/70"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
