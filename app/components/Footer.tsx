'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp, Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      ref={footerRef}
      className="relative w-full border-t border-white/5 overflow-hidden"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-green-400/20" />

      <div ref={contentRef} className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left - Branding */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex gap-2 text-xl font-[Kalam] font-normal text-white/80">
              <p>||</p>
              <h2>सुशांक</h2>
              <p>||</p>
            </div>
            <p className="text-xs text-neutral-600 font-mono">
              Crafting digital experiences
            </p>
          </div>

          {/* Center - Navigation */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
            {['About', 'Services', 'Projects', 'Experience', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="hover:text-white transition-colors duration-300 relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right - Back to top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 
                       hover:border-white/25 hover:bg-white/5 transition-all duration-300"
          >
            <span className="text-xs text-neutral-500 group-hover:text-white transition-colors duration-300 font-mono">
              Back to top
            </span>
            <ArrowUp size={14} className="text-neutral-500 group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/5" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <p className="font-mono">
            &copy; <span ref={yearRef}>2026</span> Sushanka Lamichhane. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-mono">
            Built with <Heart size={12} className="text-red-400 fill-red-400" /> using Next.js & GSAP
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
