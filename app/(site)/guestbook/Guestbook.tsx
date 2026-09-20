'use client'
import React, { useEffect, useState } from 'react'
import { Loader2, Send } from 'lucide-react'

interface Entry {
  _id: string
  name: string
  message: string
  createdAt: string
}

/** Relative "X days ago" formatting. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const secs = Math.round((Date.now() - then) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.round(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

const inputClass =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-accent/50'

const Guestbook = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    fetch('/api/guestbook')
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []))
      .catch(() => setError('Could not load messages.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !message.trim()) {
      setError('Name and message are required.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, website }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post message.')

      if (data.entry) {
        setEntries((prev) => [data.entry, ...prev])
      } else {
        load()
      }
      setName('')
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pb-24">
      {/* Form */}
      <form
        onSubmit={submit}
        className="mb-12 space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <input
          type="text"
          placeholder="Your name"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />
        <textarea
          rows={3}
          placeholder="Your message..."
          className={`${inputClass} resize-none`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
        />

        {/* Honeypot — hidden from humans, tempting to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Sign
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </form>

      {/* Messages */}
      {loading ? (
        <p className="text-sm text-muted">Loading messages…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted">No messages yet. Be the first to sign.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li
              key={entry._id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-foreground">{entry.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {timeAgo(entry.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {entry.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Guestbook
