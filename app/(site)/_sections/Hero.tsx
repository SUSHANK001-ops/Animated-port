'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ArrowRight, Github, Linkedin } from 'lucide-react'
import { identity, socials } from '@/data/config'
import Pinwheel from '../../ui/delight/Pinwheel'
import NptClock from '../../ui/delight/NptClock'

const Hero = () => {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const github = socials.find((s) => s.label === 'GitHub')?.url ?? '#'
  const linkedin = socials.find((s) => s.label === 'LinkedIn')?.url ?? '#'

  return (
    <section ref={rootRef} className="editorial pt-32 pb-10 md:pt-40">
      {/* Top row: avatar + availability + live clock */}
      <div data-hero className="mb-9 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={identity.profileImage}
            alt={identity.name}
            width={52}
            height={52}
            className="h-13 w-13 rounded-full object-cover ring-1 ring-border"
            style={{ width: 52, height: 52 }}
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {identity.availability}
          </span>
        </div>
        <NptClock variant="inline" />
      </div>

      {/* Headline + pinwheel */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1
            data-hero
            className="text-3xl font-semibold tracking-tight text-foreground md:text-[2.6rem] md:leading-[1.05]"
          >
            {identity.name}
          </h1>
          <p data-hero className="mt-2 font-mono text-sm text-accent">
            {identity.role}
          </p>
        </div>
        <div data-hero className="hidden shrink-0 sm:block">
          <Pinwheel size={92} />
        </div>
      </div>

      {/* Crafted bio */}
      <p
        data-hero
        className="mt-7 text-lg leading-relaxed text-foreground/80"
      >
        I build{' '}
        <span className="marker-underline font-medium text-foreground">
          cloud infrastructure and web apps
        </span>{' '}
        from {identity.location} — clean design, reliable deploys, and things
        that keep running while you sleep.
      </p>

      {/* Actions */}
      <div data-hero className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/projects"
          data-click-sound
          className="pop-btn group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background"
        >
          View work
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          data-click-sound
          className="pop-btn inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
        >
          <Github size={15} /> GitHub
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          data-click-sound
          className="pop-btn inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
        >
          <Linkedin size={15} /> LinkedIn
        </a>
      </div>
    </section>
  )
}

export default Hero
