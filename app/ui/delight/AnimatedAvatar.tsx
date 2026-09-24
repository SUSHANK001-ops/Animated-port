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
const HOVER_SEQUENCE = [3, 4, 5, 6]
const HOVER_HOLD_LOOP = [5, 6]

// Timings (ms) — tuned so the hover reveal is smooth and legible.
const IDLE_INTERVAL = 700
const HOVER_STEP = 260 // time each of frames 3..6 is shown
const HOLD_INTERVAL = 560

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
      // Hover: play frames 3→4→5→6 in sequence, one at a time.
      HOVER_SEQUENCE.forEach((frame, idx) => {
        const t = setTimeout(() => setActive(frame), idx * HOVER_STEP)
        timers.current.push(t)
      })
      // After the sequence finishes, hold a soft 5 ↔ 6 loop.
      const startHold = setTimeout(() => {
        let b = 0
        setActive(HOVER_HOLD_LOOP[0])
        const loop = setInterval(() => {
          b = (b + 1) % HOVER_HOLD_LOOP.length
          setActive(HOVER_HOLD_LOOP[b])
        }, HOLD_INTERVAL)
        timers.current.push(loop)
      }, HOVER_SEQUENCE.length * HOVER_STEP)
      timers.current.push(startHold)
    }

    return clearTimers
  }, [hover])

  return (
    <div
      className={`group relative ${className}`}
      style={{ width: size, height: size }}
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
