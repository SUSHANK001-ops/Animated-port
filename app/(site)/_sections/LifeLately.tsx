'use client'
import React from 'react'
import { photos } from '@/data/config'
import { Block } from '../../ui/editorial'
import NptClock from '../../ui/delight/NptClock'
import SpotifyNowPlaying from '../../ui/delight/SpotifyNowPlaying'
import PolaroidStrip from '../../ui/delight/PolaroidStrip'

/**
 * A warm "off the clock" section: live NPT time, what I'm listening to, and a
 * strip of Polaroids. Mirrors the small delightful widgets on the inspiration
 * site while staying personal.
 */
const LifeLately = () => {
  return (
    <div className="editorial">
      <Block label="Off the clock" title="Life lately">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <NptClock />
          <SpotifyNowPlaying />
        </div>

        <div className="mt-8">
          <p className="eyebrow mb-4">A few stray frames along the way</p>
          <PolaroidStrip photos={photos} />
        </div>
      </Block>
    </div>
  )
}

export default LifeLately
