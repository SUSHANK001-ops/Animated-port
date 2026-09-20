'use client'
import React from 'react'
import Image from 'next/image'
import { Github, Linkedin, Download } from 'lucide-react'
import { identity, stats } from '@/data/config'
import StatBox from '../../ui/StatBox'
import { useGsapReveal } from '../../ui/useGsapReveal'

const AboutCards = () => {
  const cardsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.15 })
  const statsRef = useGsapReveal<HTMLDivElement>({ stagger: 0.1 })

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <div ref={cardsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: profile card */}
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 md:flex-row md:items-center md:p-8">
          <Image
            src={identity.profileImage}
            alt={identity.name}
            width={120}
            height={120}
            className="h-28 w-28 shrink-0 rounded-xl object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold text-foreground">{identity.name}</h3>
            <p className="mt-1 font-mono text-sm text-accent">{identity.role}</p>
            <p className="mt-2 text-sm text-muted">
              {identity.location} {identity.locationFlag}
            </p>
            <p className="mt-1 font-mono text-xs text-muted">{identity.education}</p>
          </div>
        </div>

        {/* Right: bio card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="space-y-3">
            {identity.bio.slice(0, 3).map((line, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/80">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/SUSHANK001-ops"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/lamichhane--68b754341/?skipRedirect=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href={identity.resume}
              download
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10"
            >
              <Download size={14} /> Resume
            </a>
          </div>
        </div>
      </div>

      {/* Stat boxes */}
      <div ref={statsRef} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <StatBox key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  )
}

export default AboutCards
