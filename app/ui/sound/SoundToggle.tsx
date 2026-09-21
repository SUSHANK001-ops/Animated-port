'use client'
import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useSoundFx } from './SoundProvider'

const SoundToggle = () => {
  const { enabled, toggle } = useSoundFx()

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Mute click sounds' : 'Enable click sounds'}
      title={enabled ? 'Mute click sounds' : 'Enable click sounds'}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/50 hover:text-foreground"
    >
      {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  )
}

export default SoundToggle
