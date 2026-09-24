'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * A sprite-style animated avatar built from /public/textures/1..6.png.
 *
 * - Idle (not hovered): loops frames 1 ↔ 2 like a gentle breathing GIF.
 * - Hover: plays the full reveal sequence 3 → 4 → 5 → 6 at a readable pace,
 *   then holds a gentle 5 ↔ 6 loop. On leave it returns to the idle loop.
 *
 * All six frames are preloaded (stacked, only the active one visible) so the
 * swap is instant with no flicker. No card/background — transparent PNGs sit
 * directly on the page.
 */

const IDLE_FRAMES = [1, 2]
const HOVER_FRAMES = [3, 4, 5, 6]

// Timings (ms) — tuned so the hover reveal is smooth and legible.
const IDLE_INTERVAL = 700
const HOVER_STEP = 220 // time each hover frame (3..6) is shown before advancing

interface AnimatedAvatarProps {
  size?: number
  className?: string
}

const AnimatedAvatar = ({ size = 180, className = '' }: AnimatedAvatarProps) => {
  const [active, setActive] = useState(1) // currently-shown frame (1..6)
  const [hover, setHover] = useState(false)
  const timers = useRef<Array<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>>([])

  const clearTimers = () => {
    timers.current.forEach((t) => {
      clearTimeout(t as ReturnType<typeof setTimeout>)
      clearInterval(t as ReturnType<typeof setInterval>)
    })
    timers.current = []
  }

  useEffect(() => {
    clearTimers()

    if (!hover) {
      // Idle: gently toggle between frame 1 and 2.
      let i = 0
      setActive(IDLE_FRAMES[0])
      const id = setInterval(() => {
        i = (i + 1) % IDLE_FRAMES.length
        setActive(IDLE_FRAMES[i])
      }, IDLE_INTERVAL)
      timers.current.push(id)
    } else {
      // Hover: continuously cycle through ALL reveal frames 3→4→5→6→3…
      let i = 0
      setActive(HOVER_FRAMES[0])
      const loop = setInterval(() => {
        i = (i + 1) % HOVER_FRAMES.length
        setActive(HOVER_FRAMES[i])
      }, HOVER_STEP)
      timers.current.push(loop)
    }

    return clearTimers
  }, [hover])

  return (
    <div
      className={`group relative cursor-pointer ${className}`}
      style={{
        width: size,
        height: size,
        transform: hover ? 'translateX(6px) rotate(3deg)' : 'translateX(0) rotate(0deg)',
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Stacked frames — all preloaded, only the active one shown. */}
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <Image
          key={n}
          src={`/textures/${n}.png`}
          alt="Sushanka"
          width={size}
          height={size}
          priority={n <= 2}
          className="absolute inset-0 object-contain transition-opacity duration-150 ease-out"
          style={{
            width: size,
            height: size,
            opacity: active === n ? 1 : 0,
          }}
        />
      ))}
    </div>
  )
}

export default AnimatedAvatar
