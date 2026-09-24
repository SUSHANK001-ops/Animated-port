'use client'
import React from 'react'

interface OrigamiShurikenProps {
  size?: number
  className?: string
}

/**
 * A folded-paper shuriken (origami throwing star). Four points, each made of
 * two crisp flat facets in different coloured papers — the fold line runs down
 * the middle of every point so it reads as folded paper, not a flat sticker.
 *
 * It spins slowly on its own; on hover it speeds up and the facets "re-fold"
 * (a subtle build animation) via CSS. Sits inside a `.group` so hover works
 * from the whole cluster.
 */
const OrigamiShuriken = ({ size = 104, className = '' }: OrigamiShurikenProps) => {
  // Each point: two triangular facets (light + shadowed) so it looks folded.
  const points = [
    { rot: 0, light: 'var(--c-red)', dark: '#b83a2c' },
    { rot: 90, light: 'var(--c-blue)', dark: '#6d93c4' },
    { rot: 180, light: 'var(--c-green)', dark: '#78a86d' },
    { rot: 270, light: 'var(--c-yellow)', dark: '#c9a840' },
  ]

  return (
    <div className={`group inline-flex flex-col items-center ${className}`} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="origami-spin overflow-visible drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]"
      >
        <g style={{ transformOrigin: '50px 50px' }}>
          {points.map((p, i) => (
            <g
              key={p.rot}
              transform={`rotate(${p.rot} 50 50)`}
              className="origami-point"
              style={{ ['--i' as string]: i }}
            >
              {/* outer light facet */}
              <path d="M50 50 L50 4 L68 40 Z" fill={p.light} />
              {/* inner shadowed facet (the fold) */}
              <path d="M50 50 L50 4 L32 40 Z" fill={p.dark} />
            </g>
          ))}
          {/* centre square knot (rotated 45°) */}
          <rect x="42" y="42" width="16" height="16" rx="1.5" transform="rotate(45 50 50)" fill="#fffdf5" />
          <rect x="45.5" y="45.5" width="9" height="9" rx="1" transform="rotate(45 50 50)" fill="var(--foreground)" opacity="0.85" />
        </g>
      </svg>
      {/* little stick + pin, like a mounted paper toy */}
      <div
        style={{ height: size * 0.5, width: 2.5 }}
        className="-mt-0.5 rounded-full bg-[color-mix(in_srgb,var(--foreground)_30%,transparent)]"
      />
      <span className="-mt-1 h-2.5 w-2.5 rounded-full bg-c-red shadow-sm" />
    </div>
  )
}

export default OrigamiShuriken
