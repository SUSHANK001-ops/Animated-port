'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ArrowRight, Github, Linkedin } from 'lucide-react'
import { identity, socials } from '@/data/config'
import Sticker from '../../ui/Sticker'

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
    <section ref={rootRef} className="editorial pt-32 pb-16 md:pt-40">
      {/* Avatar + availability */}
      <div data-hero className="mb-8 flex items-center justify-between">
        <Image
          src={identity.profileImage}
          alt={identity.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover ring-1 ring-border"
        />
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted">
          <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {identity.availability}
        </span>
      </div>

      {/* Name + role */}
      <h1 data-hero className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {identity.name}
      </h1>
      <p data-hero className="mt-1 font-mono text-sm text-accent">
        {identity.role}
      </p>

      {/* Bio */}
      <p data-hero className="mt-6 text-lg leading-relaxed text-foreground/75">
        I build cloud infrastructure and web applications from {identity.location} — clean
        design, reliable deploys, and things that keep running while you sleep.
      </p>

      {/* Actions */}
      <div data-hero className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/projects"
          data-click-sound
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
        >
          View work
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          data-click-sound
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
        >
          <Github size={15} /> GitHub
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          data-click-sound
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
        >
          <Linkedin size={15} /> LinkedIn
        </a>

        {/* Subtle draggable sticker */}
        <div className="ml-auto hidden sm:block">
          <Sticker name="wave" size={56} draggable rotate={-6} />
        </div>
      </div>
    </section>
  )
}

export default Hero
