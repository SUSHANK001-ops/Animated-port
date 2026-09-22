'use client'
import React, { useMemo } from 'react'

/** A single hand-drawn flower on a stem. */
function Flower({ color, size }: { color: string; size: number }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg width={size} height={size * 2.2} viewBox="0 0 40 88" fill="none">
      {/* stem */}
      <path d="M20 88 L20 34" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {/* leaf */}
      <path d="M20 60 Q30 54 32 46 Q22 48 20 58 Z" fill="var(--accent)" opacity="0.85" />
      {/* petals */}
      {petals.map((r) => (
        <ellipse
          key={r}
          cx="20"
          cy="20"
          rx="6"
          ry="12"
          fill={color}
          opacity="0.92"
          transform={`rotate(${r} 20 20) translate(0 -9)`}
        />
      ))}
      {/* center */}
      <circle cx="20" cy="20" r="6" fill="var(--accent-warm)" />
    </svg>
  )
}

const COLORS = [
  'var(--accent-secondary)',
  'var(--accent-warm)',
  '#c084fc',
  '#60a5fa',
  '#f472b6',
  'var(--accent)',
]

/**
 * A field of gently swaying flowers used as a footer border. Positions are
 * generated once (deterministic per render seed) so nothing jumps around.
 */
const FlowerField = ({ count = 22 }: { count?: number }) => {
  const flowers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280
        const rnd = seed / 233280
        return {
          left: (i / count) * 100 + (rnd - 0.5) * 4,
          size: 20 + Math.round(rnd * 16),
          color: COLORS[i % COLORS.length],
          dur: 3.2 + rnd * 2.6,
          delay: rnd * 2,
        }
      }),
    [count]
  )

  return (
    <div className="flower-field" aria-hidden="true">
      {flowers.map((f, i) => (
        <div
          key={i}
          className="flower"
          style={{
            left: `${f.left}%`,
            ['--dur' as string]: `${f.dur}s`,
            ['--delay' as string]: `${f.delay}s`,
          }}
        >
          <Flower color={f.color} size={f.size} />
        </div>
      ))}
    </div>
  )
}

export default FlowerField
