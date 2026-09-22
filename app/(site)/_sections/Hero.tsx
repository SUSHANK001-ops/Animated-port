'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { Github, Linkedin, Instagram, Mail } from 'lucide-react'
import { identity, socials } from '@/data/config'

const socialIcon: Record<string, React.ElementType> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Email: Mail,
}

const Hero = () => {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="editorial pt-28 pb-6 md:pt-32">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 data-hero className="serif-title serif-hero">
            {identity.name}
          </h1>
          <p data-hero className="mt-1.5 text-sm text-muted">
            {identity.role}
          </p>
          <p
            data-hero
            className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-foreground/80"
          >
            I craft{' '}
            <span className="marker-underline font-medium text-foreground">
              minimal and functional
            </span>{' '}
            cloud infrastructure and web apps. Focused on clean design, reliable
            deploys, and building with modern tools.
          </p>

          {/* Socials */}
          <div data-hero className="mt-6 flex items-center gap-1">
            {socials.map((s) => {
              const Icon = socialIcon[s.label] ?? Github
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-click-sound
                  aria-label={s.label}
                  className="pop-btn rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <Icon size={17} />
                </a>
              )
            })}
          </div>
        </div>

        {/* Avatar */}
        <div data-hero className="shrink-0">
          <div className="relative">
            <Image
              src={identity.profileImage}
              alt={identity.name}
              width={92}
              height={92}
              className="h-20 w-20 rounded-2xl object-cover ring-1 ring-border md:h-23 md:w-23"
              style={{ width: 92, height: 92 }}
            />
            <span className="pulse-dot absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-c-green" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
