'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'

const FLOWERS = [
  '/decor/flower-blossom.svg',
  '/decor/flower-sun.svg',
  '/decor/flower-tulip.svg',
  '/decor/flower-daisy.svg',
  '/decor/flower-rose.svg',
  '/decor/flower-hibiscus.svg',
]

/**
 * A field of gently swaying real flower illustrations used as a footer
 * border. Each flower sits on a thin stem and sways on its own timing.
 * Positions are deterministic so nothing jumps between renders.
 */
const FlowerField = ({ count = 26 }: { count?: number }) => {
  const flowers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280
        const rnd = seed / 233280
        return {
          left: (i / count) * 100 + (rnd - 0.5) * 3,
          size: 22 + Math.round(rnd * 18),
          stem: 26 + Math.round(rnd * 26),
          src: FLOWERS[i % FLOWERS.length],
          dur: 3.2 + rnd * 2.6,
          delay: rnd * 2.5,
        }
      }),
    [count]
  )

  return (
    <div className="flower-field" aria-hidden="true">
      {flowers.map((f, i) => (
        <div
          key={i}
          className="flower flex flex-col items-center"
          style={{
            left: `${f.left}%`,
            ['--dur' as string]: `${f.dur}s`,
            ['--delay' as string]: `${f.delay}s`,
          }}
        >
          <Image
            src={f.src}
            alt=""
            width={f.size}
            height={f.size}
            className="drop-shadow-sm"
            style={{ width: f.size, height: f.size }}
          />
          {/* stem */}
          <span
            className="w-[2px] rounded-full bg-c-green"
            style={{ height: f.stem }}
          />
        </div>
      ))}
    </div>
  )
}

export default FlowerField
