'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, ArrowRight, Sparkles, Rocket, Code2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Marquee = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const marqueeTrackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badges stagger in
      gsap.fromTo(
        badgesRef.current?.children ?? [],
        { opacity: 0, y: 40, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Text fade in
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // CTA buttons
      gsap.fromTo(
        ctaRef.current?.children ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Stats counter animation
      gsap.fromTo(
        statsRef.current?.children ?? [],
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Infinite marquee scroll
      if (marqueeTrackRef.current) {
        gsap.to(marqueeTrackRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 20,
          ease: 'none',
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const marqueeWords = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS',
    'GSAP', 'Three.js', 'Express', 'PostgreSQL', 'Docker', 'Git',
  ]

  return (
    <div ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Top divider */}
      <div className="h-px w-4/5 mx-auto bg-white/10 mb-16" />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        {/* Badges */}
        <div ref={badgesRef} className="flex flex-wrap gap-3 mb-8">
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#FF8C00] px-5 py-2.5 text-lg font-bold text-black shadow-lg md:text-xl">
            <Rocket size={18} />
            From Concept to Cloud.
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#E9A8F2] px-5 py-2.5 text-lg font-bold text-black shadow-[0_4px_12px_rgba(233,168,242,0.3)] md:text-xl">
            <Sparkles size={18} />
            Ship Products
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#00ff88] px-5 py-2.5 text-lg font-bold text-black shadow-[0_4px_12px_rgba(0,255,136,0.2)] md:text-xl">
            <Code2 size={18} />
            Clean Code
          </span>
        </div>

        {/* Description */}
        <p
          ref={textRef}
          className="max-w-2xl text-xl md:text-2xl lg:text-3xl leading-relaxed text-neutral-300 mb-10"
        >
          Whether I&apos;m architecting robust backend systems or crafting
          intuitive user journeys, I bridge the gap between complex logic and
          beautiful design.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 mb-16">
          <a
            href="/sushankResume.pdf"
            download
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm
                       bg-green-400 text-black
                       hover:shadow-[0_0_30px_rgba(0,255,136,0.25)] transition-all duration-300
                       active:scale-[0.98]"
          >
            <Download size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span>Download CV</span>
          </a>
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm
                       border border-white/15 text-neutral-300 hover:text-white hover:border-white/30
                       hover:bg-white/5 transition-all duration-300"
          >
            <span>View Projects</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="flex flex-wrap gap-8 md:gap-14 mb-16">
          {[
            { value: '10+', label: 'Projects Completed' },
            { value: '3+', label: 'Happy Clients' },
            { value: '1+', label: 'Years Experience' },
          ].map((stat, i) => (
            <div key={i} className="group cursor-default">
              <p className="text-3xl md:text-4xl font-bold text-green-400">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-neutral-500 mt-1 font-mono uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden py-6 border-y border-white/5">
        <div ref={marqueeTrackRef} className="flex whitespace-nowrap w-max">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={i}
              className="mx-6 text-lg md:text-xl font-medium text-gray-200 uppercase tracking-widest select-none"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="h-px w-4/5 mx-auto bg-white/10 mt-16" />
    </div>
  )
}

export default Marquee