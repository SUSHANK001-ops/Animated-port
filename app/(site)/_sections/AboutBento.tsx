'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Download, MapPin, GraduationCap, Cloud } from 'lucide-react'
import { identity, stats, currentlyLearning } from '@/data/config'
import { Block } from '../../ui/editorial'

/**
 * Warm bento-style about grid — a nod to manishtamang.com's "About" mosaic,
 * but populated with the DevOps identity from config.
 */
const AboutBento = () => {
  return (
    <div className="editorial">
      <Block label="About" title="A little about me">
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
          {/* Intro — spans full width */}
          <div className="bento col-span-2 sm:col-span-3">
            <p className="text-[0.975rem] leading-relaxed text-foreground/80">
              {identity.bio[0]}
            </p>
            <a
              href={identity.resume}
              download
              data-click-sound
              className="pop-btn mt-4 inline-flex items-center gap-2 text-sm text-accent hover:opacity-80"
            >
              <Download size={15} /> Download résumé
            </a>
          </div>

          {/* Location */}
          <div className="bento flex flex-col justify-between">
            <MapPin size={18} className="text-accent-secondary" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">
                {identity.location} {identity.locationFlag}
              </p>
              <p className="eyebrow mt-1">Based in</p>
            </div>
          </div>

          {/* Education */}
          <div className="bento flex flex-col justify-between">
            <GraduationCap size={18} className="text-accent-warm" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">{identity.education}</p>
              <p className="eyebrow mt-1">Studying</p>
            </div>
          </div>

          {/* Currently learning */}
          <div className="bento flex flex-col justify-between">
            <Cloud size={18} className="text-accent" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">{currentlyLearning}</p>
              <p className="eyebrow mt-1">Learning now</p>
            </div>
          </div>

          {/* Stat strip — full width */}
          <div className="bento col-span-2 sm:col-span-3">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                  <p className="eyebrow mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/about"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          More about me
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Block>
    </div>
  )
}

export default AboutBento
