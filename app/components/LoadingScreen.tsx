'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressTrackRef = useRef<HTMLDivElement>(null)
  const verticalLinesRef = useRef<HTMLDivElement>(null)
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([])
  const orbRef = useRef<HTMLDivElement>(null)
  const [counter, setCounter] = useState(0)
  const hasRun = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // Guard against React Strict Mode double-mount
    if (hasRun.current) return
    hasRun.current = true

    const container = containerRef.current
    const counterEl = counterRef.current
    const nameEl = nameRef.current
    const taglineEl = taglineRef.current
    const progressBar = progressBarRef.current
    const progressTrack = progressTrackRef.current
    const orb = orbRef.current
    const corners = cornerRefs.current.filter(Boolean) as HTMLDivElement[]
    const lines = verticalLinesRef.current
      ? Array.from(verticalLinesRef.current.children) as HTMLElement[]
      : []

    // If refs aren't ready, skip straight to completion
    if (!container || !counterEl || !nameEl || !taglineEl || !progressBar || !progressTrack || !orb) {
      onCompleteRef.current()
      return
    }

    const counterObj = { val: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => onCompleteRef.current(),
        })

        exitTl
          .to(counterEl, { opacity: 0, y: -30, duration: 0.4, ease: 'power3.in' })
          .to(progressTrack, { opacity: 0, scaleX: 0, duration: 0.4, ease: 'power3.in' }, '<')
          .to(nameEl, { opacity: 0, y: -40, duration: 0.5, ease: 'power3.in' }, '-=0.2')
          .to(taglineEl, { opacity: 0, y: -30, duration: 0.4, ease: 'power3.in' }, '-=0.3')

        if (corners.length > 0) {
          exitTl.to(corners, { opacity: 0, scale: 0, duration: 0.3, stagger: 0.05, ease: 'power3.in' }, '-=0.3')
        }

        exitTl.to(orb, { scale: 15, opacity: 0, duration: 0.8, ease: 'power2.in' }, '-=0.4')

        if (lines.length > 0) {
          exitTl.to(lines, { scaleY: 0, duration: 0.5, stagger: 0.04, ease: 'power3.in' }, '-=0.6')
        }

        exitTl.to(container, { clipPath: 'inset(50% 0% 50% 0%)', duration: 0.8, ease: 'power4.inOut' }, '-=0.3')
      },
    })

    // Phase 1: Grid lines appear
    if (lines.length > 0) {
      tl.fromTo(lines, { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.03, ease: 'power3.out' })
    }

    // Phase 2: Corner brackets animate in
    if (corners.length > 0) {
      tl.fromTo(
        corners,
        { opacity: 0, scale: 0, rotation: -90 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' },
        lines.length > 0 ? '-=0.3' : '+=0'
      )
    }

    // Phase 3: Orb pulses in
    tl.fromTo(orb, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.3')

    // Phase 4: Name reveals
    tl.fromTo(
      nameEl,
      { opacity: 0, y: 60, clipPath: 'inset(100% 0% 0% 0%)' },
      { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    )

    // Phase 5: Tagline slides up
    tl.fromTo(taglineEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')

    // Phase 6: Progress bar + counter
    tl.fromTo(progressTrack, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    tl.fromTo(counterEl, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '-=0.3')

    // Phase 7: Count up and fill progress bar
    tl.to(counterObj, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        setCounter(Math.round(counterObj.val))
      },
    })
    tl.to(progressBar, { scaleX: 1, duration: 2, ease: 'power2.inOut' }, '<')

    // Orb float animation
    gsap.to(orb, { y: -10, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' })

    // Pulsing glow on orb
    gsap.to(orb, {
      boxShadow: '0 0 60px rgba(0,255,136,0.4), 0 0 120px rgba(0,255,136,0.1)',
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    // No cleanup — we use hasRun guard instead, so animations aren't killed by Strict Mode
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        zIndex: 10000,
        background: 'radial-gradient(ellipse at center, #1f1f1f 0%, #111111 40%, #0a0a0a 100%)',
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Vertical scan lines */}
      <div ref={verticalLinesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px origin-top"
            style={{
              left: `${((i + 1) / 8) * 100}%`,
              background:
                'linear-gradient(to bottom, transparent, rgba(0,255,136,0.06) 30%, rgba(0,255,136,0.06) 70%, transparent)',
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>

      {/* Corner brackets */}
      {[
        { top: '8%', left: '8%', rotate: '0deg', borderSides: 'border-t-2 border-l-2' },
        { top: '8%', right: '8%', rotate: '0deg', borderSides: 'border-t-2 border-r-2' },
        { bottom: '8%', left: '8%', rotate: '0deg', borderSides: 'border-b-2 border-l-2' },
        { bottom: '8%', right: '8%', rotate: '0deg', borderSides: 'border-b-2 border-r-2' },
      ].map((pos, i) => (
        <div
          key={i}
          ref={(el) => { cornerRefs.current[i] = el }}
          className={`absolute w-8 h-8 md:w-12 md:h-12 ${pos.borderSides} border-green-400/30`}
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            transform: `rotate(${pos.rotate})`,
          }}
        />
      ))}

      {/* Central content */}
      <div className="relative flex flex-col items-center gap-6 z-10 px-4">
        {/* Floating orb */}
        <div
          ref={orbRef}
          className="w-3 h-3 rounded-full mb-4"
          style={{
            background: 'radial-gradient(circle, #00ff88 0%, #00cc6a 50%, transparent 70%)',
            boxShadow: '0 0 30px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1)',
          }}
        />

        {/* Name */}
        <div ref={nameRef} className="text-center">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            <span className="text-green-400">S</span>ushanka
          </h1>
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          className="text-center"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-neutral-500 font-mono">
            Developer &bull; Designer &bull; Engineer
          </p>
        </div>

        {/* Progress section */}
        <div className="flex flex-col items-center gap-3 mt-8 w-64 md:w-80">
          {/* Progress bar track */}
          <div
            ref={progressTrackRef}
            className="w-full h-px bg-white/10 relative overflow-hidden origin-left"
          >
            {/* Progress bar fill */}
            <div
              ref={progressBarRef}
              className="absolute inset-0 origin-left"
              style={{
                background: 'linear-gradient(90deg, transparent, #00ff88)',
                transform: 'scaleX(0)',
              }}
            />
          </div>

          {/* Counter */}
          <span
            ref={counterRef}
            className="text-xs font-mono text-neutral-500 tabular-nums tracking-widest"
          >
            {String(counter).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* Bottom signature line */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-white/10" />
          <span className="text-[10px] font-mono text-neutral-600 italic">
            योगः कर्मसु कौशलम्
          </span>
          <div className="w-8 h-px bg-white/10" />
        </div>
        <span className="text-[9px] font-mono text-neutral-700">
          Excellence in action is Yoga &mdash; Bhagavad Gita 2.50
        </span>
        <span className="text-[9px] font-mono text-neutral-700 mt-1">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </div>
  )
}

export default LoadingScreen
