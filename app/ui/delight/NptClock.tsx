'use client'
import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { identity } from '@/data/config'

/** Current time in Nepal (Asia/Kathmandu, UTC+5:45). */
function nepalNow() {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  return time
}

interface NptClockProps {
  /** `card` = standalone bento widget, `inline` = small footer/hero label. */
  variant?: 'card' | 'inline'
  className?: string
}

const NptClock = ({ variant = 'card', className = '' }: NptClockProps) => {
  // Start null so server and first client render match, then tick on mount.
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    // Defer the first read to the next frame so it isn't a synchronous
    // setState inside the effect body.
    const raf = requestAnimationFrame(() => setTime(nepalNow()))
    const id = setInterval(() => setTime(nepalNow()), 1000 * 20)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
  }, [])

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono text-xs text-muted ${className}`}>
        <Clock size={12} />
        {time ?? '––:––'} NPT
      </span>
    )
  }

  return (
    <div className={`bento flex h-full flex-col justify-between ${className}`}>
      <div className="flex items-center gap-2 text-muted">
        <Clock size={15} />
        <span className="eyebrow">Local time</span>
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold tabular-nums text-foreground">
        {time ?? '––:––'}
      </p>
      <p className="mt-1 text-xs text-muted">
        {identity.location} {identity.locationFlag} · UTC+5:45
      </p>
    </div>
  )
}

export default NptClock
