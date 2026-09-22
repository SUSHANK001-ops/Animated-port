'use client'
import React from 'react'

interface PinwheelProps {
  size?: number
  className?: string
}

/**
 * A hand-drawn style paper pinwheel that spins on its own and speeds up on
 * hover (via the `.group` + `.pinwheel-spin` CSS pair). Sits on a little stick.
 */
const Pinwheel = ({ size = 96, className = '' }: PinwheelProps) => {
  const blades = [
    { rot: 0, fill: 'var(--accent)' },
    { rot: 90, fill: 'var(--accent-secondary)' },
    { rot: 180, fill: 'var(--accent-warm)' },
    { rot: 270, fill: 'var(--accent-secondary)' },
  ]

  return (
    <div
      className={`group inline-flex flex-col items-center ${className}`}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="pinwheel-spin overflow-visible"
      >
        {blades.map((b) => (
          <path
            key={b.rot}
            d="M50 50 L50 6 Q72 12 70 46 Z"
            fill={b.fill}
            transform={`rotate(${b.rot} 50 50)`}
            opacity="0.92"
          />
        ))}
        <circle cx="50" cy="50" r="6" fill="var(--foreground)" />
        <circle cx="50" cy="50" r="2.5" fill="var(--background)" />
      </svg>
      {/* Stick */}
      <div
        style={{ height: size * 0.55, width: 3 }}
        className="-mt-1 rounded-full bg-[color-mix(in_srgb,var(--foreground)_35%,transparent)]"
      />
    </div>
  )
}

export default Pinwheel
