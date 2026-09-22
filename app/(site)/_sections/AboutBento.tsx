'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { identity, currentlyLearning, photos } from '@/data/config'
import { Block } from '../../ui/editorial'
import Draggable from '../../ui/Draggable'
import SpotifyNowPlaying from '../../ui/delight/SpotifyNowPlaying'

// Primary tools shown as vector logos in the brown card's mini toolbar.
const primaryTools = [
  { src: '/tech/docker.svg', label: 'Docker' },
  { src: '/tech/kubernetes.svg', label: 'Kubernetes' },
  { src: '/tech/aws.svg', label: 'AWS' },
  { src: '/tech/typescript.svg', label: 'TypeScript' },
  { src: '/tech/nextjs.svg', label: 'Next.js' },
]

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
          {/* Sticky-note / intro card with a DRAGGABLE name note */}
          <div className="tile tile-blue col-span-2 flex min-h-[180px] flex-col justify-between">
            <Draggable rotate={-4} className="w-fit">
              <div className="relative bg-[#fffdf5] px-5 py-4 shadow-md dark:bg-[#26241c]">
                {/* pin */}
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-c-green shadow" />
                <p className="font-devanagari text-base text-foreground/80">
                  {identity.name}
                </p>
                <p className="mt-0.5 text-[0.7rem] text-muted">drag me around ✦</p>
              </div>
            </Draggable>
            <Link
              href="/about"
              data-click-sound
              className="pop-btn mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-c-yellow px-3.5 py-1.5 text-xs font-medium text-foreground"
            >
              About me
            </Link>
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
            <span className="absolute bottom-2 left-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[0.6rem] text-white backdrop-blur-sm">
              {photo.caption}
            </span>
          </div>

          {/* Green welcome card */}
          <div className="tile tile-green col-span-2 flex flex-col justify-between md:col-span-1">
            <p className="text-sm font-medium text-foreground">
              Welcome to my corner of the internet 👋
            </p>
            <p className="tile-sub mt-2 text-xs text-foreground/55">{identity.location}</p>
          </div>

          {/* Now-playing / album card */}
          <div className="tile col-span-2 bg-surface md:col-span-1">
            <SpotifyNowPlaying bare />
          </div>

          {/* Currently learning — wide brown card with vector-icon toolbar */}
          <div className="tile tile-brown col-span-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center md:col-span-4">
            <div>
              <p className="text-sm font-semibold">Constantly learning</p>
              <p className="tile-sub mt-1 max-w-md text-xs">
                Outside of client work I&apos;m going deeper on {currentlyLearning},
                automating everything, and sharpening my craft.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#fffdf5] px-3 py-2 shadow-sm dark:bg-[#1c1b14]">
              {primaryTools.map((t) => (
                <span
                  key={t.label}
                  title={t.label}
                  className="grid h-7 w-7 place-items-center transition-transform hover:-translate-y-1 hover:scale-110"
                >
                  <Image src={t.src} alt={t.label} width={22} height={22} />
                </span>
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
