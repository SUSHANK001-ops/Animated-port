'use client'
import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

/**
 * Live local-time note for the contact page. Shows the current time in
 * Nepal (Asia/Kathmandu) so visitors know when a reply is likely.
 */
const LocalTimeNote = () => {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kathmandu',
      }).format(new Date())

    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 1000 * 30)
    return () => clearInterval(id)
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
