'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Music2 } from 'lucide-react'

interface SpotifyState {
  configured: boolean
  isPlaying: boolean
  track?: { name: string; artist: string; albumArt: string | null; url: string | null }
}

/** Equalizer bars shown when a track is actively playing. */
function Equalizer() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent"
          style={{
            height: 14,
            transformOrigin: 'bottom',
            animation: `eq 0.9s ease-in-out ${i * 0.13}s infinite alternate`,
          }}
        />
      ))}
      <style>{`@keyframes eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }`}</style>
    </span>
  )
}

const SpotifyNowPlaying = ({ className = '' }: { className?: string }) => {
  const [state, setState] = useState<SpotifyState | null>(null)

  useEffect(() => {
    const load = () =>
      fetch('/api/spotify')
        .then((r) => r.json())
        .then(setState)
        .catch(() => setState({ configured: false, isPlaying: false }))
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  const track = state?.track
  const playing = state?.isPlaying

  return (
    <div className={`bento flex h-full flex-col justify-between ${className}`}>
      <div className="flex items-center gap-2 text-muted">
        <Music2 size={15} />
        <span className="eyebrow">{playing ? 'Now playing' : 'Recent favorite'}</span>
        {playing && <span className="ml-auto"><Equalizer /></span>}
      </div>

      {track ? (
        <a
          href={track.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 flex items-center gap-3"
        >
          {track.albumArt ? (
            <Image
              src={track.albumArt}
              alt={track.name}
              width={52}
              height={52}
              className="h-13 w-13 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
              style={{ width: 52, height: 52 }}
            />
          ) : (
            <div className="flex h-13 w-13 items-center justify-center rounded-lg border border-border" style={{ width: 52, height: 52 }}>
              <Music2 size={18} className="text-muted" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground group-hover:text-accent">
              {track.name}
            </p>
            <p className="truncate text-xs text-muted">{track.artist}</p>
          </div>
        </a>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-muted">Quiet for now.</p>
          <p className="mt-1 text-xs text-muted/70">Music is never far away.</p>
        </div>
      )}
    </div>
  )
}

export default SpotifyNowPlaying
