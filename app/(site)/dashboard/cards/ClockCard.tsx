'use client'
import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { identity } from '@/data/config'

/** Formats the current time in Nepal (Asia/Kathmandu, UTC+5:45). */
function nepalNow() {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const date = now.toLocaleDateString('en-US', {
    timeZone: 'Asia/Kathmandu',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return { time, date }
}

const ClockCard = () => {
  const [{ time, date }, setNow] = useState(nepalNow())

  useEffect(() => {
    const id = setInterval(() => setNow(nepalNow()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2 text-muted">
        <Clock size={16} />
        <span className="font-mono text-xs uppercase tracking-widest">Local Time</span>
      </div>

      <div className="mt-6">
        <p className="font-mono text-4xl font-bold tabular-nums text-foreground md:text-5xl">
          {time}
        </p>
        <p className="mt-2 text-sm text-muted">{date}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-foreground">
          {identity.location} {identity.locationFlag}
        </span>
        <span className="font-mono text-xs text-accent">NPT · UTC+5:45</span>
      </div>
    </div>
  )
}

export default ClockCard
