'use client'
import React from 'react'
import Image from 'next/image'

export interface Polaroid {
  src: string
  caption: string
  /** Resting rotation in degrees for a hand-placed feel. */
  rotate?: number
}

interface PolaroidStripProps {
  photos: Polaroid[]
  className?: string
}

/**
 * A row of tilted Polaroid photos. Each straightens and lifts on hover.
 * On small screens it becomes a horizontal scroll strip.
 */
const PolaroidStrip = ({ photos, className = '' }: PolaroidStripProps) => {
  return (
    <div
      className={`flex gap-4 overflow-x-auto pb-4 sm:flex-wrap sm:justify-center sm:overflow-visible ${className}`}
    >
      {photos.map((p, i) => (
        <figure
          key={i}
          className="polaroid shrink-0"
          style={{ width: 148, transform: `rotate(${p.rotate ?? 0}deg)` }}
        >
          <div className="relative h-[132px] w-full overflow-hidden rounded-[2px] bg-surface-2">
            <Image
              src={p.src}
              alt={p.caption}
              fill
              sizes="148px"
              className="object-cover"
            />
          </div>
          <figcaption className="caption">{p.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export default PolaroidStrip
