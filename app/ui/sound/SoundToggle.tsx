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
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all hover:bg-foreground/8 hover:text-foreground active:scale-90"
    >
      {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
    </button>
  )
}

export default SoundToggle
