'use client'
import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

const formatNepalTime = () =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kathmandu',
  }).format(new Date())

/**
 * Live local-time note for the contact page. Shows the current time in
 * Nepal (Asia/Kathmandu) so visitors know when a reply is likely.
 *
 * The initial value is null (server render + first client paint match to
 * avoid hydration mismatch); the real time is set from the interval.
 */
const LocalTimeNote = () => {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    // Set immediately via the async tick, then keep it fresh every 30s.
    const tick = () => setTime(formatNepalTime())
    const id = setInterval(tick, 1000 * 30)
    const raf = requestAnimationFrame(tick)
    return () => {
      clearInterval(id)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!time) return null

  return (
    <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
      <Clock size={14} className="text-accent/70" />
      It&apos;s <span className="font-medium text-foreground">{time}</span> in Nepal 🇳🇵
    </p>
  )
}

export default LocalTimeNote
