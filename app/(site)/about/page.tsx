import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Download } from 'lucide-react'
import { identity, techStack, socials, stats, experience, photos } from '@/data/config'
import Pinwheel from '../../ui/delight/Pinwheel'
import PolaroidStrip from '../../ui/delight/PolaroidStrip'

export const metadata: Metadata = {
  title: 'About · Sushanka Lamichhane',
  description: identity.heroTagline,
}

// Map tech names to the downloaded vector logos where we have them.
const techIcon: Record<string, string> = {
  AWS: '/tech/aws.svg',
  Docker: '/tech/docker.svg',
  Kubernetes: '/tech/kubernetes.svg',
  Terraform: '/tech/terraform.svg',
  Linux: '/tech/linux.svg',
  React: '/tech/react.svg',
  'Next.js': '/tech/nextjs.svg',
  TypeScript: '/tech/typescript.svg',
  'Node.js': '/tech/nodejs.svg',
  PostgreSQL: '/tech/postgresql.svg',
}

export default function AboutPage() {
  return (
    <div className="editorial-page pt-32 pb-16 md:pt-36">
      <p className="eyebrow eyebrow-dot mb-3">About</p>

      <div>
        <h1 className="display-serif text-4xl text-foreground md:text-5xl">{identity.name}</h1>
        <p className="mt-2 text-sm text-muted">{identity.role}</p>
        <p className="mt-5 max-w-md text-[0.975rem] leading-relaxed text-foreground/80">
          Hi, I&apos;m {identity.name.split(' ')[0]} from {identity.location}, where I{' '}
          <span className="marker-underline font-medium text-foreground">
            craft, break, and rebuild the internet
          </span>{' '}
          one deploy at a time.
        </p>
      </div>

      {/* Bio — with the origami shuriken sitting lower, beside the text */}
      <div className="mt-8 flex items-start justify-between gap-6">
        <div className="prose-calm space-y-4">
          {identity.bio.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <div className="hidden shrink-0 pt-2 sm:block">
          <Pinwheel size={104} />
        </div>
      </div>

      {/* Socials + résumé */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            data-click-sound
            className="link-underline text-sm text-muted transition-colors hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
        <a
          href={identity.resume}
          download
          data-click-sound
          className="pop-btn inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm text-background"
        >
          <Download size={14} /> Résumé
        </a>
      </div>

      {/* Polaroid strip */}
      <div className="mt-12">
        <p className="eyebrow mb-4">A few frames along the way</p>
        <PolaroidStrip photos={photos} />
      </div>

      <hr className="ed-divider" />

      {/* Education / journey timeline */}
      <h2 className="serif-title serif-section mb-6">Education & journey</h2>
      <div className="space-y-6">
        {experience.map((e) => (
          <div key={e.role} className="border-l border-border pl-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium text-foreground">{e.role}</p>
              <span className="font-mono text-xs text-muted">{e.date}</span>
            </div>
            <p className="text-sm text-link">{e.company}</p>
            <p className="mt-1.5 text-sm text-muted">{e.description}</p>
          </div>
        ))}
      </div>

      <hr className="ed-divider" />

      {/* Stats */}
      <h2 className="serif-title serif-section mb-6">By the numbers</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="display-serif text-3xl text-foreground">{s.value}</p>
            <p className="eyebrow mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <hr className="ed-divider" />

      {/* Tech stack with vector logos */}
      <h2 className="serif-title serif-section mb-6">Toolbox</h2>
      <div className="flex flex-wrap gap-2.5">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground/75 transition-all hover:-translate-y-0.5 hover:border-foreground/30"
          >
            {techIcon[tech] && (
              <Image src={techIcon[tech]} alt="" width={14} height={14} style={{ width: 14, height: 14 }} />
            )}
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}
