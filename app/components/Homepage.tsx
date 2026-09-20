'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ThreeScene from './ThreeScene'
import TechStackTerminal from './TechStackTerminal'
import { useSections } from './SectionContext' 

const Homepage = () => {
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const { registerSection } = useSections()

  useEffect(() => {
    registerSection('home', rootRef.current)
  }, [registerSection])

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3 }
      )
    }

    // Animate subtitle
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6 }
      )
    }

    // Animate tech badges
    if (badgesRef.current) {
      gsap.fromTo(
        badgesRef.current.children,
        { opacity: 0, y: 15, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.9, ease: 'back.out(1.7)' }
      )
    }

    // Animate scroll indicator
    if (scrollRef.current) {
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.2 }
      )

      // Bounce animation for scroll indicator
      gsap.to(scrollRef.current, {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      })
    }
  }, [])

  return (
    <div ref={rootRef} id='home' className="relative w-full h-screen overflow-hidden">
      <ThreeScene />
      <TechStackTerminal />

      {/* Text Overlay */}
      <div className="absolute top-1/2 left-1/2 md:top-5/12 md:left-64 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center max-w-2xl px-5">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-green-400 cursor-default transition-all duration-300 hover:scale-105"
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, color: 'white' })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })
          }}
        >
          HELLO!
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl lg:text-2xl font-light opacity-80 leading-relaxed cursor-default transition-colors duration-300"
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, { color: 'white', duration: 0.3 })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, { opacity: 0.8, duration: 0.3 })
          }}
        >
          I'm Sushanka Lamichhane, a web<br />
          developer and engineer.<br />
          Welcome to my portfolio!
        </p>

        {/* Tech badges */}
        <div
          ref={badgesRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {['AWS', 'Docker', 'Kubernetes', 'Red Hat Certified'].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs md:text-sm font-mono text-neutral-300
                         backdrop-blur-sm transition-colors duration-300 hover:border-green-400/50 hover:text-green-400"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-center"
      >
        <p className="text-sm opacity-70 mb-2">Scroll to explore</p>
        <div className="w-6 h-10 border-2 border-white border-opacity-50 rounded-xl flex justify-center mx-auto">
          <div className="w-0.5 h-2 bg-white bg-opacity-70 rounded self-center" />
        </div>
      </div>
    </div>
  )
}

export default Homepage