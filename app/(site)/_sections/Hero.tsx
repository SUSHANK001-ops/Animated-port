'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { identity } from '@/data/config'
import NptClock from '../../ui/delight/NptClock'
import AnimatedAvatar from '../../ui/delight/AnimatedAvatar'

const Hero = () => {
  const rootRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const [hover, setHover] = useState(false)

  // Staggered entrance on load.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Subtle magnetic pull on the name.
  const onNameMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const el = nameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${x * 0.06}px, ${y * 0.1}px)`
  }
  const onNameLeave = () => {
    setHover(false)
    if (nameRef.current) nameRef.current.style.transform = 'translate(0, 0)'
  }

  return (
    <section ref={rootRef} className="editorial-page pt-32 md:pt-40">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          {/* Name that flips to the @handle on hover */}
          <h1
            ref={nameRef}
            data-hero
            onMouseEnter={() => setHover(true)}
            onMouseMove={onNameMove}
            onMouseLeave={onNameLeave}
            className="display-serif inline-block cursor-default text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground transition-transform duration-300 ease-out md:text-6xl"
          >
            <span className="relative inline-block overflow-hidden align-bottom [perspective:600px]">
              <span
                className="block transition-all duration-300 ease-out"
                style={{
                  transform: hover
                    ? 'translateY(-100%) rotateX(90deg)'
                    : 'translateY(0) rotateX(0deg)',
                  opacity: hover ? 0 : 1,
                }}
              >
                {identity.name}
              </span>
              <span
                className="absolute inset-0 block text-link transition-all duration-300 ease-out"
                style={{
                  transform: hover
                    ? 'translateY(0) rotateX(0deg)'
                    : 'translateY(100%) rotateX(-90deg)',
                  opacity: hover ? 1 : 0,
                }}
              >
                @sushank-ops
              </span>
            </span>
          </h1>

          <p data-hero className="mt-3 text-base font-medium tracking-tight text-muted">
            {identity.role}
          </p>

          {/* Short crafted bio */}
          <p
            data-hero
            className="mt-6 max-w-md text-[1.05rem] leading-[1.7] text-foreground/75"
          >
            I build{' '}
            <span className="marker-underline font-semibold text-foreground">
              cloud infrastructure and web apps
            </span>{' '}
            from {identity.location} — clean design, reliable deploys, and
            things that keep running while you sleep.
          </p>

          {/* Availability + live clock */}
          <div data-hero className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
              <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-c-green" />
              {identity.availability}
            </span>
            <NptClock variant="inline" />
          </div>
        </div>

        {/* Animated avatar — idle loops frames 1↔2, hover plays 3→6 */}
        <div data-hero className="relative hidden shrink-0 self-center sm:block">
          <AnimatedAvatar size={200} />
        </div>
      </div>
    </section>
  )
}

export default Hero
