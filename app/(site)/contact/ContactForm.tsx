'use client'
import React, { useEffect, useState } from 'react'
import { Loader2, ShieldCheck, Check, Send, Mail, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react'

type OtpStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'

const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

const fieldBase =
  'w-full rounded-xl border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition-all duration-200'

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
  const emailLooksValid = isEmailValid(form.email)
  const verified = otpStatus === 'verified' && verifiedEmail === normalizedEmail
  const codeSent = otpStatus === 'sent' || otpStatus === 'verifying' || otpStatus === 'error'

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
      setOtpMessage('Email verified — you can send your message now.')
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
    if (!form.message.trim()) {
      setSendStatus('error')
      setSubmitMessage('Write a message before sending.')
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
      setSubmitMessage('Your message was sent successfully. I will be in touch soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setVerifiedEmail('')
      setOtpStatus('idle')
      setOtpMessage('')
    } catch (err) {
      setSendStatus('error')
      setSubmitMessage(err instanceof Error ? err.message : 'Unable to send the message right now.')
    } finally {
      setSending(false)
      setTimeout(() => setSendStatus('idle'), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name + Subject row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className={`${fieldBase} border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/15`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
            Subject
          </label>
          <input
            type="text"
            placeholder="What's this about?"
            className={`${fieldBase} border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/15`}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>
      </div>

      {/* Email + verification — one guided block */}
      <div className="rounded-2xl border border-border bg-surface-2/40 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <Mail size={13} /> Email
          </label>
          {verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
              <CheckCircle2 size={13} /> Verified
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@example.com"
            disabled={verified}
            className={`${fieldBase} flex-1 border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/15 disabled:opacity-60`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!verified && (
            <button
              type="button"
              onClick={requestOtp}
              disabled={!emailLooksValid || otpStatus === 'sending' || otpStatus === 'verifying'}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-background transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {otpStatus === 'sending' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {codeSent ? 'Resend code' : 'Send code'}
            </button>
          )}
        </div>

        {/* Code entry — only appears after a code has been sent */}
        {codeSent && !verified && (
          <div className="mt-4 border-t border-border/60 pt-4">
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted">
              Enter the 6-digit code
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                className={`${fieldBase} flex-1 border-border text-center font-mono text-lg tracking-[0.5em] focus:border-accent/60 focus:ring-2 focus:ring-accent/15`}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={code.length !== 6 || otpStatus === 'verifying'}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/5 px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {otpStatus === 'verifying' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <ShieldCheck size={15} />
                )}
                Verify
              </button>
            </div>
          </div>
        )}

        {otpMessage && (
          <p
            className={`mt-3 flex items-center gap-1.5 text-xs ${
              otpStatus === 'error'
                ? 'text-c-red'
                : verified
                ? 'text-accent'
                : 'text-muted'
            }`}
          >
            {otpStatus === 'error' ? (
              <AlertCircle size={13} />
            ) : verified ? (
              <Check size={13} />
            ) : null}
            {otpMessage}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <MessageSquare size={13} /> Message
        </label>
        <textarea
          rows={6}
          placeholder="Tell me about your project, idea, or just say hi..."
          className={`${fieldBase} resize-none border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/15`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={sending || !verified}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
            sendStatus === 'success'
              ? 'bg-accent text-background'
              : sendStatus === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-accent text-background hover:scale-[1.02]'
          } ${sending || !verified ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {sending
            ? 'Sending...'
            : sendStatus === 'success'
            ? 'Message sent!'
            : sendStatus === 'error'
            ? 'Failed to send'
            : 'Send message'}
          {sending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : sendStatus === 'success' ? (
            <Check size={16} />
          ) : (
            <Send size={16} />
          )}
        </button>
        {!verified && (
          <span className="text-xs text-muted">Verify your email to enable sending.</span>
        )}
      </div>

      {submitMessage && (
        <p
          className={`flex items-center gap-1.5 text-sm ${
            sendStatus === 'error' ? 'text-c-red' : 'text-accent'
          }`}
        >
          {sendStatus === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          {submitMessage}
        </p>
      )}
    </form>
  )
}

export default ContactForm
