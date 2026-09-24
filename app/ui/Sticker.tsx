'use client'
import React from 'react'
import Image from 'next/image'
import Draggable from './Draggable'

export type StickerName = 'wave' | 'rocket' | 'coffee' | 'code' | 'star'

interface StickerProps {
  name: StickerName
  size?: number
  /** Make the sticker draggable. */
  draggable?: boolean
  /** Slight resting rotation for a hand-placed feel. */
  rotate?: number
  /** Gentle idle float. */
  float?: boolean
  className?: string
  alt?: string
}

/**
 * Animated GIF sticker. Real GIFs live in /public/stickers. Optionally
 * draggable and/or gently floating. Uses unoptimized <Image> so the GIF
 * keeps animating (Next's optimizer would freeze the first frame).
 */
const Sticker = ({
  name,
  size = 88,
  draggable = false,
  rotate = 0,
  float = false,
  className = '',
  alt = '',
}: StickerProps) => {
  const img = (
    <Image
      src={`/stickers/${name}.gif`}
      alt={alt || `${name} sticker`}
      width={size}
      height={size}
      unoptimized
      className={`pointer-events-none ${float ? 'sticker-float' : ''}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  )

  if (draggable) {
    return (
      <Draggable rotate={rotate} className={className}>
        {img}
      </Draggable>
    )
  }

  return (
    <div
      className={className}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {img}
    </div>
  )
}

export default Sticker
