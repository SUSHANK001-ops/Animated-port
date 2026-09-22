'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { identity } from '@/data/config'
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

  return (
    <section ref={rootRef} className="editorial-page pt-32 md:pt-36">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1
            data-hero
            className="display-serif text-4xl text-foreground md:text-5xl"
          >
            {identity.name}
          </h1>
          <p data-hero className="mt-2 text-sm text-muted">
            {identity.role}
          </p>

          {/* Short crafted bio */}
          <p
            data-hero
            className="mt-5 max-w-md text-[0.975rem] leading-relaxed text-foreground/80"
          >
            I build{' '}
            <span className="marker-underline font-medium text-foreground">
              cloud infrastructure and web apps
            </span>{' '}
            from {identity.location} — clean design, reliable deploys, and
            things that keep running while you sleep.
          </p>

          {/* Availability + live clock */}
          <div data-hero className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted">
              <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-c-green" />
              {identity.availability}
            </span>
            <NptClock variant="inline" />
          </div>
        </div>

        {/* Character avatar (bobbing) */}
        <div data-hero className="hidden shrink-0 sm:block">
          <div className="avatar-bob relative">
            <Image
              src={identity.profileImage}
              alt={identity.name}
              width={104}
              height={104}
              className="rounded-2xl object-cover ring-1 ring-border"
              style={{ width: 104, height: 104 }}
            />
            <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-base shadow-sm">
              {identity.locationFlag}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
