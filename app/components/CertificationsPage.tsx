'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Award } from 'lucide-react'

import { useSections } from './SectionContext'

gsap.registerPlugin(ScrollTrigger)

interface Certification {
  name: string
  issuer: string
  year: string
}

const certifications: Certification[] = [
  { name: 'Red Hat Linux Starter', issuer: 'Red Hat', year: '2025' },
  {
    name: 'Decoding DevOps (AWS, Docker, Kubernetes, Terraform, CI/CD, GitOps)',
    issuer: 'Udemy',
    year: '2025',
  },
  { name: 'MERN Stack', issuer: 'Digital Pathshala', year: '2025' },
  { name: 'Full-Stack Web Dev', issuer: 'OneRoadmap', year: '2025' },
  { name: 'React Developer', issuer: 'Udemy', year: '2025' },
  { name: 'Python', issuer: 'DataFlair', year: '2025' },
]

const CertificationsPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { registerSection } = useSections()

  useEffect(() => {
    registerSection('certifications', sectionRef.current)
  }, [registerSection])

  const headingRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative min-h-screen w-full py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-20">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4 font-mono">
          Credentials
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-green-400">Certifications</span>
        </h2>
        <div
          ref={lineRef}
          className="mx-auto mt-6 h-0.5 w-24 bg-green-400 origin-center"
        />
      </div>

      {/* Cards grid: 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {certifications.map((cert, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) cardsRef.current[index] = el
            }}
            className="group relative p-6 rounded-2xl border border-green-400/15 bg-white/[0.03] backdrop-blur-sm
                       hover:border-green-400/40 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
          >
            {/* Year badge, top-right */}
            <span className="absolute top-4 right-4 text-xs font-mono px-2.5 py-1 rounded-full border border-green-400/25 text-green-400 bg-green-400/10">
              {cert.year}
            </span>

            {/* Icon */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-white/10 bg-green-400/10 group-hover:border-white/20 transition-colors duration-300">
              <Award size={22} className="text-green-400" />
            </div>

            {/* Name (bold) */}
            <h3 className="text-base md:text-lg font-bold text-white/90 leading-snug pr-10 group-hover:text-white transition-colors duration-300">
              {cert.name}
            </h3>

            {/* Issuer (smaller, muted) */}
            <p className="mt-2 text-sm text-neutral-500 font-mono">{cert.issuer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CertificationsPage
