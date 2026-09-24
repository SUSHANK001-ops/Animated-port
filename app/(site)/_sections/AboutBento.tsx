'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
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

// Name split across two lines like the reference note.
const [nameLine1, ...nameRest] = identity.name.split(' ')
const nameLine2 = nameRest.join(' ')

const AboutBento = () => {
  const photo = photos[0]
  const gridRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="editorial-page">
      <Block label="About" title="A little about me">
        <div
          ref={gridRef}
          className={`bento-stagger grid grid-cols-2 gap-3 md:grid-cols-3 md:auto-rows-[168px] ${
            inView ? 'in-view' : ''
          }`}
        >
          {/* Blue note card — draggable name note. tile-open + high z so the
              note is never clipped or hidden beneath sibling cards. */}
          <div className="tile tile-open tile-blue relative z-30 col-span-1 flex min-h-[160px] flex-col justify-between md:col-span-1">
            <Draggable rotate={-5} className="w-fit">
              <div
                className="relative px-5 py-4"
                style={{
                  background: '#fffdf5',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.10)',
                }}
              >
                {/* pin */}
                <span className="absolute -top-2 left-4 h-3.5 w-3.5 rounded-full bg-c-green shadow-md ring-2 ring-white/70" />
                <p className="font-devanagari text-[1.05rem] font-medium leading-tight text-[#2a2620]">
                  {nameLine1}
                  <br />
                  {nameLine2}
                </p>
                <p className="mt-1 text-[0.66rem] text-[#8a8378]">drag me anywhere ✦</p>
              </div>
            </Draggable>
            <Link
              href="/about"
              data-click-sound
              className="pop-btn inline-flex w-fit items-center gap-1.5 self-end rounded-full bg-c-yellow px-4 py-1.5 text-xs font-semibold text-[#2a2620]"
            >
              About me
            </Link>
          </div>

          {/* Pink role card */}
          <div className="tile tile-pink flex min-h-[160px] flex-col justify-between">
            <Sparkles size={18} className="text-foreground/50" />
            <div>
              <p className="text-base font-bold leading-tight tracking-tight text-foreground">
                {identity.shortRole}
              </p>
              <p className="tile-sub mt-1 text-xs text-foreground/55">& Full-Stack Dev</p>
              <p className="eyebrow mt-3">Current role</p>
            </div>
          </div>

          {/* Photo card — full width on mobile, spans TWO rows (tall) on md+ like the reference */}
          <div className="tile relative col-span-2 min-h-[220px] overflow-hidden p-0 md:col-span-1 md:row-span-2 md:min-h-0">
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="(max-width:768px) 100vw, 240px"
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-[0.62rem] font-medium text-white backdrop-blur-sm">
              {photo.caption}
            </span>
          </div>

          {/* Green welcome card — with a "My journey" link */}
          <div className="tile tile-green col-span-1 flex min-h-[150px] flex-col justify-between">
            <p className="text-[0.9rem] font-semibold leading-snug text-foreground">
              Welcome to my corner of the web — where infrastructure meets craft. 👋
            </p>
            <Link
              href="/about"
              data-click-sound
              className="group/j mt-2 inline-flex w-fit items-center gap-1 text-xs font-semibold text-foreground/70 transition-colors hover:text-foreground"
            >
              My journey
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover/j:-translate-y-0.5 group-hover/j:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Recent favorite / now-playing — same single-cell size as the pink card above it */}
          <div className="tile tile-frost col-span-1 min-h-[150px]">
            <SpotifyNowPlaying bare />
          </div>

          {/* Constantly learning — wide brown card, full width */}
          <div className="tile tile-brown col-span-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center md:col-span-3">
            <div>
              <p className="text-base font-bold tracking-tight">Constantly learning</p>
              <p className="tile-sub mt-1.5 max-w-md text-xs leading-relaxed">
                Outside of client work I&apos;m going deeper on {currentlyLearning},
                automating everything, and sharpening my craft.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#fffdf5] px-3 py-2 shadow-sm dark:bg-[#1c1b14]">
              {primaryTools.map((t) => (
                <span
                  key={t.label}
                  title={t.label}
                  className="grid h-7 w-7 place-items-center transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110"
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
