'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

interface SoundContextValue {
  enabled: boolean
  toggle: () => void
  play: () => void
}

const SoundContext = createContext<SoundContextValue | undefined>(undefined)

const STORAGE_KEY = 'portfolio-sound'
const CLICK_SRC = '/sounds/click.mp3'

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Default OFF — browsers block autoplay audio and many users prefer silence.
  const [enabled, setEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(STORAGE_KEY) === 'on')
    } catch {
      /* ignore */
    }
    const el = new Audio(CLICK_SRC)
    el.preload = 'auto'
    el.volume = 0.35
    audioRef.current = el
  }, [])

  const play = () => {
    if (!enabled || !audioRef.current) return
    try {
      const a = audioRef.current.cloneNode() as HTMLAudioElement
      a.volume = 0.35
      void a.play().catch(() => {})
    } catch {
      /* ignore playback errors */
    }
  }

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  // Global delegation: any element with [data-click-sound] plays the click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!enabled) return
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-click-sound]')) play()
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundFx() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSoundFx must be used within SoundProvider')
  return ctx
}
