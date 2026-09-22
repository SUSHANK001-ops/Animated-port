'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { identity, currentlyLearning, photos } from '@/data/config'
import { Block } from '../../ui/editorial'
import SpotifyNowPlaying from '../../ui/delight/SpotifyNowPlaying'

/**
 * Colourful bento mosaic — the manishtamang.com "About" grid, populated
 * with this site's real identity. Colour lives here (soft tinted tiles),
 * while the rest of the page stays quiet monochrome.
 */
const AboutBento = () => {
  const photo = photos[0]

  return (
    <div className="editorial-page">
      <Block label="About" title="A little about me">
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {/* Note / intro card */}
          <div className="tile tile-blue col-span-2 flex flex-col justify-between">
            <p className="text-[0.9rem] leading-relaxed text-foreground/85">
              {identity.bio[0]}
            </p>
            <a
              href={identity.resume}
              download
              data-click-sound
              className="pop-btn mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-foreground/85 px-3.5 py-1.5 text-xs font-medium text-background"
            >
              <Download size={13} /> Résumé
            </a>
          </div>

          {/* Role card */}
          <div className="tile tile-pink flex flex-col justify-between">
            <Sparkles size={18} className="text-foreground/60" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground">{identity.shortRole}</p>
              <p className="tile-sub mt-1 text-xs text-foreground/55">& Full-Stack Dev</p>
            </div>
          </div>

          {/* Photo card */}
          <div className="tile relative col-span-1 min-h-[132px] overflow-hidden p-0">
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="180px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Green welcome card */}
          <div className="tile tile-green col-span-2 flex flex-col justify-between md:col-span-1">
            <p className="text-sm font-medium text-foreground">Welcome to my corner of the internet 👋</p>
            <p className="tile-sub mt-2 text-xs text-foreground/55">{identity.location}</p>
          </div>

          {/* Now-playing / album card */}
          <div className="tile col-span-2 bg-surface md:col-span-1">
            <SpotifyNowPlaying />
          </div>

          {/* Currently learning — wide brown card with mini toolbar */}
          <div className="tile tile-brown col-span-2 flex items-center justify-between md:col-span-4">
            <div>
              <p className="text-sm font-semibold">Currently learning</p>
              <p className="tile-sub mt-1 text-xs">{currentlyLearning}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {['#e0483a', '#efd071', '#b6d8a8', '#a9c8ec', '#c9aef0'].map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full transition-transform hover:scale-125"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/about"
          data-click-sound
          className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          More about me
          <ArrowRight size={15} className="arrow-slide" />
        </Link>
      </Block>
    </div>
  )
}

export default AboutBento
