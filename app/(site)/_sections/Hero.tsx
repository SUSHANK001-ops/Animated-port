'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { identity, heroBadges, marqueeItems } from '@/data/config'
import MarqueeStrip from '../../ui/MarqueeStrip'
import Sticker from '../../ui/Sticker'

const Hero = () => {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '[data-hero-label]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '[data-hero-line]',
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          '-=0.2'
        )
        .fromTo(
          '[data-hero-tagline]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '[data-hero-badge]',
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' },
          '-=0.3'
        )
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-16"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />

      {/* Draggable sticker prop */}
      <div className="absolute right-8 top-28 z-20 hidden lg:block">
        <Sticker name="wave" size={110} draggable rotate={-8} />
      </div>

      <div className="relative mx-auto w-full max-w-7xl flex-1 px-6 pb-28 pt-16 md:px-10">
        {/* Availability label */}
        <div
          data-hero-label
          className="mb-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted"
        >
          <span className="pulse-dot relative inline-block h-2 w-2 rounded-full bg-accent" />
          {identity.availability} &rarr;
        </div>

        {/* Giant stacked hero text */}
        <h1 className="flex flex-col text-[clamp(3.5rem,15vw,11rem)] font-extrabold leading-[0.85] tracking-tighter">
          <span data-hero-line className="text-stroke">
            {identity.heroLines[0]}
          </span>
          <span data-hero-line className="text-foreground">
            {identity.heroLines[1]}
          </span>
          <span
            data-hero-line
            className="text-accent"
            style={{ fontSize: '0.5em', lineHeight: 1 }}
          >
            {identity.heroLines[2]}
          </span>
          <span data-hero-line className="text-foreground">
            {identity.heroLines[3]}
          </span>
        </h1>

        {/* Tagline */}
        <p
          data-hero-tagline
          className="mt-10 max-w-md text-sm text-muted md:text-base"
        >
          {identity.heroTagline}
        </p>

        {/* Badges */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {heroBadges.map((badge) => (
            <span
              key={badge}
              data-hero-badge
              className="rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 font-mono text-xs text-accent"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom marquee strip */}
      <div className="relative">
        <MarqueeStrip items={marqueeItems} duration={36} />
      </div>
    </section>
  )
}

export default Hero
