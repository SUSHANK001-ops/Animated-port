'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Cloud, Server, Sparkles } from 'lucide-react'
import { identity, currentlyLearning, techStack } from '@/data/config'
import Reveal from '../../ui/Reveal'
import SpotifyNowPlaying from '../../ui/delight/SpotifyNowPlaying'

/**
 * Colourful bento mosaic — the one place bold colour lives, mirroring the
 * inspiration's About grid. Everything else stays quiet monochrome.
 */
const AboutBento = () => {
  return (
    <div className="editorial">
      <Reveal>
        <p className="eyebrow mb-3">About</p>
        <h2 className="serif-title serif-section mb-6">
          I craft thoughtful digital experiences
        </h2>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Blue note — role */}
          <div className="bento-color bento-blue col-span-2 flex flex-col justify-between sm:col-span-2">
            <span className="eyebrow">Current role</span>
            <div className="mt-8">
              <p className="serif-title text-xl">DevOps Engineer</p>
              <p className="mt-1 text-sm text-foreground/70">& Full-Stack Developer</p>
            </div>
          </div>

          {/* Pink — photo */}
          <div className="bento-color bento-pink zoom-parent relative col-span-1 min-h-[132px] p-0">
            <Image
              src={identity.profileImage}
              alt={identity.name}
              fill
              sizes="200px"
              className="zoom-img object-cover"
            />
          </div>

          {/* Green — location */}
          <div className="bento-color bento-green col-span-1 flex flex-col justify-between">
            <Sparkles size={18} className="text-foreground/70" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">{identity.location}</p>
              <p className="eyebrow mt-0.5">{identity.locationFlag} Based in</p>
            </div>
          </div>

          {/* Yellow — learning */}
          <div className="bento-color bento-yellow col-span-2 flex flex-col justify-between sm:col-span-2">
            <span className="eyebrow">Constantly learning</span>
            <div className="mt-8">
              <p className="text-[0.95rem] leading-relaxed text-foreground/80">
                Right now I&apos;m deep in{' '}
                <span className="font-semibold text-foreground">{currentlyLearning}</span> —
                sharpening infra and shipping cleaner deploys.
              </p>
            </div>
          </div>

          {/* Brown wide — mini stack toolbar */}
          <div className="bento-color bento-brown col-span-2 flex flex-col justify-between sm:col-span-2">
            <div className="flex items-center gap-2">
              <Cloud size={16} className="opacity-80" />
              <span className="eyebrow">Building scalable systems</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-1.5">
              {techStack.slice(0, 8).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[0.65rem]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Spotify + backend note row */}
      <Reveal delay={120}>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="bento flex flex-col justify-between">
            <Server size={18} className="text-muted" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">Backend & Cloud</p>
              <p className="mt-1 text-xs text-muted">
                Node, PostgreSQL, AWS, Docker, Kubernetes — designed, built, shipped, monitored.
              </p>
            </div>
          </div>
          <SpotifyNowPlaying />
        </div>
      </Reveal>

      <Reveal>
        <Link
          href="/about"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-1.5 text-sm text-link"
        >
          <span className="link-quiet">About me</span>
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </div>
  )
}

export default AboutBento
