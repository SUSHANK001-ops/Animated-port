'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Loader2, Send, Github, LogOut } from 'lucide-react'

interface Entry {
  _id: string
  name: string
  message: string
  avatar?: string
  provider?: string
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

const GoogleGlyph = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M21.35 11.1H12v3.83h5.35c-.23 1.4-1.62 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 7.1 12 7.1c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 4.5 14.6 3.6 12 3.6 6.98 3.6 2.9 7.68 2.9 12.7s4.08 9.1 9.1 9.1c5.25 0 8.72-3.69 8.72-8.88 0-.6-.07-1.05-.15-1.5Z"
    />
  </svg>
)

const Guestbook = () => {
  const { data: session, status } = useSession()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
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
    if (!message.trim()) {
      setError('Write a message first.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, website }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post message.')

      if (data.entry) setEntries((prev) => [data.entry, ...prev])
      else load()
      setMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pb-24">
      {/* Compose / auth area */}
      {status === 'loading' ? (
        <div className="mb-12 flex items-center gap-2 rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          <Loader2 size={15} className="animate-spin" /> Checking session…
        </div>
      ) : session?.user ? (
        <form
          onSubmit={submit}
          className="mb-12 space-y-4 rounded-2xl border border-border bg-surface p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'You'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-sm text-foreground">
                Signed in as <strong>{session.user.name}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
              data-click-sound
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>

          <textarea
            rows={3}
            placeholder="Leave a message…"
            className={`${inputClass} resize-none`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />

          {/* Honeypot */}
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
              data-click-sound
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Sign guestbook
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        </form>
      ) : (
        <div className="mb-12 rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-foreground">Sign in to leave a message</p>
          <p className="mt-1 text-xs text-muted">
            Your name and avatar come from your account. No spam, promise.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => signIn('github')}
              data-click-sound
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent/50"
            >
              <Github size={15} /> Continue with GitHub
            </button>
            <button
              onClick={() => signIn('google')}
              data-click-sound
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent/50"
            >
              <GoogleGlyph /> Continue with Google
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {loading ? (
        <p className="text-sm text-muted">Loading messages…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted">No messages yet. Be the first to sign.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry._id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {entry.avatar && (
                    <Image
                      src={entry.avatar}
                      alt={entry.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-semibold text-foreground">{entry.name}</span>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {timeAgo(entry.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{entry.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Guestbook
