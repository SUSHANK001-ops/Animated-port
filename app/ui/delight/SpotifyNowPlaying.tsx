'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Music2, ArrowUpRight } from 'lucide-react'

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
          className="w-[3px] rounded-full bg-c-green"
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

/**
 * Album art with a vinyl record that peeks out from behind, to the RIGHT of
 * the art only. It's boxed in a fixed 72px-wide container so the disk can
 * never slide over the track text. Spins on card hover.
 */
function Disk({ art }: { art: string | null }) {
  return (
    <span
      className="disk-wrap relative block shrink-0 overflow-hidden"
      style={{ width: 72, height: 52 }}
      aria-hidden="true"
    >
      {/* the vinyl, peeking from behind the art, spins on hover */}
      <span className="disk absolute left-5 top-0" style={{ width: 52, height: 52 }} />
      {/* album art on top */}
      {art ? (
        <Image
          src={art}
          alt=""
          width={52}
          height={52}
          className="relative z-10 rounded-md object-cover shadow-sm"
          style={{ width: 52, height: 52 }}
        />
      ) : (
        <span
          className="relative z-10 grid place-items-center rounded-md border border-border bg-surface"
          style={{ width: 52, height: 52 }}
        >
          <Music2 size={18} className="text-muted" />
        </span>
      )}
    </span>
  )
}

const SpotifyNowPlaying = ({
  className = '',
  bare = false,
}: {
  className?: string
  /** When true, render without the .bento card wrapper (for embedding in a tile). */
  bare?: boolean
}) => {
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
    <div className={`${bare ? '' : 'bento'} group/spotify flex h-full flex-col justify-between ${className}`}>
      <div className="flex items-center gap-2 text-muted">
        <Music2 size={15} className="text-c-green" />
        <span className="eyebrow">{playing ? 'Now playing' : 'Recent favorite'}</span>
        {playing ? (
          <span className="ml-auto"><Equalizer /></span>
        ) : (
          <span className="ml-auto grid h-4 w-4 place-items-center rounded-full bg-c-green text-[8px] font-bold text-white">
            ♪
          </span>
        )}
      </div>

      {track ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <Disk art={track.albumArt} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{track.name}</p>
              <p className="truncate text-xs text-muted">{track.artist}</p>
            </div>
          </div>
          <a
            href={track.url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            data-click-sound
            className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-medium text-c-green transition-colors hover:opacity-80"
          >
            View track
            <ArrowUpRight size={12} className="transition-transform group-hover/spotify:-translate-y-0.5 group-hover/spotify:translate-x-0.5" />
          </a>
        </>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <Disk art={null} />
          <div>
            <p className="text-sm font-semibold text-foreground">Quiet for now.</p>
            <p className="mt-0.5 text-xs text-muted">Music is never far away.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpotifyNowPlaying
