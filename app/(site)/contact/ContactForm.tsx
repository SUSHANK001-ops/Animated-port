'use client'
import React, { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, Check, Send } from 'lucide-react'

type OtpStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'

const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

const inputClass =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-colors focus:border-accent/50'

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [code, setCode] = useState('')
  const [otpStatus, setOtpStatus] = useState<OtpStatus>('idle')
  const [otpMessage, setOtpMessage] = useState('')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const normalizedEmail = form.email.trim().toLowerCase()

  // Reset verification if the email changes after being verified.
  useEffect(() => {
    if (verifiedEmail && verifiedEmail !== normalizedEmail) {
      setVerifiedEmail('')
      setCode('')
      setOtpStatus('idle')
      setOtpMessage('')
    }
  }, [normalizedEmail, verifiedEmail])

  const requestOtp = async () => {
    if (!isEmailValid(form.email)) {
      setOtpStatus('error')
      setOtpMessage('Enter a valid email address first.')
      return
    }
    setOtpStatus('sending')
    setOtpMessage('Sending verification code...')
    try {
      const res = await fetch('/api/contact/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code.')
      setOtpStatus('sent')
      setOtpMessage('Verification code sent. Check your inbox.')
      setCode('')
    } catch (err) {
      setOtpStatus('error')
      setOtpMessage(err instanceof Error ? err.message : 'Failed to send verification code.')
    }
  }

  const verifyOtp = async () => {
    if (!code.trim()) {
      setOtpStatus('error')
      setOtpMessage('Enter the verification code from your email.')
      return
    }
    setOtpStatus('verifying')
    setOtpMessage('Verifying code...')
    try {
      const res = await fetch('/api/contact/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to verify the code.')
      setOtpStatus('verified')
      setOtpMessage('Email verified. You can send your message now.')
      setVerifiedEmail(normalizedEmail)
      setCode('')
    } catch (err) {
      setOtpStatus('error')
      setOtpMessage(err instanceof Error ? err.message : 'Failed to verify the code.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage('')

    if (!isEmailValid(form.email)) {
      setSendStatus('error')
      setSubmitMessage('Enter a valid email address.')
      return
    }
    if (verifiedEmail !== normalizedEmail || otpStatus !== 'verified') {
      setSendStatus('error')
      setSubmitMessage('Verify your email before sending the message.')
      return
    }

    setSending(true)
    setSendStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSendStatus('success')
      setSubmitMessage('Your message was sent successfully.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setVerifiedEmail('')
      setOtpStatus('idle')
      setOtpMessage('')
    } catch (err) {
      setSendStatus('error')
      setSubmitMessage(err instanceof Error ? err.message : 'Unable to send the message right now.')
    } finally {
      setSending(false)
      setTimeout(() => setSendStatus('idle'), 4000)
    }
  }

  const verified = otpStatus === 'verified' && verifiedEmail === normalizedEmail

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={requestOtp}
              disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {otpStatus === 'sending' && <Loader2 size={14} className="animate-spin" />}
              Send code
            </button>
            {verified ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                <Check size={13} /> Verified for this email
              </span>
            ) : (
              <span className="text-xs text-muted">Request a code before submitting.</span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                className={`${inputClass} flex-1 font-mono tracking-[0.3em]`}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {otpStatus === 'verifying' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                Verify
              </button>
            </div>
            {otpMessage && (
              <p
                className={`text-xs ${
                  otpStatus === 'error'
                    ? 'text-c-red'
                    : otpStatus === 'verified'
                    ? 'text-accent'
                    : 'text-muted'
                }`}
              >
                {otpMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
          Subject
        </label>
        <input
          type="text"
          placeholder="What's this about?"
          className={inputClass}
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
          Message
        </label>
        <textarea
          rows={6}
          placeholder="Tell me about your project..."
          className={`${inputClass} resize-none`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
          sendStatus === 'success'
            ? 'bg-accent text-background'
            : sendStatus === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-accent text-background hover:scale-[1.02]'
        } ${sending ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        {sending
          ? 'Sending...'
          : sendStatus === 'success'
          ? 'Message Sent!'
          : sendStatus === 'error'
          ? 'Failed to Send'
          : 'Send Message'}
        {sendStatus === 'success' ? <Check size={16} /> : <Send size={16} />}
      </button>

      {submitMessage && (
        <p className={`text-sm ${sendStatus === 'error' ? 'text-c-red' : 'text-accent'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  )
}

export default ContactForm
