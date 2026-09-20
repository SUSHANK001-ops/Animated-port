'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  y?: number
  duration?: number
  delay?: number
  /** Stagger children instead of animating the container itself. */
  stagger?: number
  start?: string
  once?: boolean
}

/**
 * Fade + rise reveal on scroll. Returns a ref to attach to the target.
 * If `stagger` is set, animates the element's direct children.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null)
  const {
    y = 32,
    duration = 0.8,
    delay = 0,
    stagger,
    start = 'top 85%',
    once = true,
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [y, duration, delay, stagger, start, once])

  return ref
}
