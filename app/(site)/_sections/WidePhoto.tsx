'use client'
import React from 'react'
import Image from 'next/image'
import { photos } from '@/data/config'

/**
 * A single wide photo with a subtle zoom-on-hover frame — the calm visual
 * beat before the footer, like the wide group photo on the inspiration site.
 */
const WidePhoto = () => {
  const photo = photos[1] ?? photos[0]

  return (
    <div className="editorial-page" id="life-lately">
      <div className="photo-frame relative aspect-[16/9] w-full">
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
        />
        <span className="absolute bottom-3 left-3 rounded-md bg-black/45 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {photo.caption}
        </span>
      </div>
    </div>
  )
}

export default WidePhoto
