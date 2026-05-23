'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, Mail, MapPin, ArrowUpRight, Copy, Check, Loader2, ShieldCheck } from 'lucide-react'

import { useSections } from './SectionContext'

gsap.registerPlugin(ScrollTrigger)

const ContactPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { registerSection } = useSections()

  useEffect(() => {
    registerSection('contact', sectionRef.current)
  }, [registerSection])

  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'>('idle')
  const [otpMessage, setOtpMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [verifiedEmail, setVerifiedEmail] = useState('')

  const normalizedEmail = formState.email.trim().toLowerCase()
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  useEffect(() => {
    if (verifiedEmail && verifiedEmail !== normalizedEmail) {
      setVerifiedEmail('')
      setVerificationCode('')
      setOtpStatus('idle')
      setOtpMessage('')
    }
  }, [normalizedEmail, verifiedEmail])

  const copyEmail = () => {
    navigator.clipboard.writeText('mail@sushanka.com.np')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requestOtp = async () => {
    if (!isEmailValid(formState.email)) {
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
        body: JSON.stringify({ email: formState.email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.')
      }

      setOtpStatus('sent')
      setOtpMessage('Verification code sent. Check your inbox.')
      setVerificationCode('')
    } catch (error) {
      setOtpStatus('error')
      setOtpMessage(error instanceof Error ? error.message : 'Failed to send verification code.')
    }
  }

  const verifyOtp = async () => {
    if (!isEmailValid(formState.email)) {
      setOtpStatus('error')
      setOtpMessage('Enter a valid email address first.')
      return
    }

    if (!verificationCode.trim()) {
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
        body: JSON.stringify({ email: formState.email, code: verificationCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify the code.')
      }

      setOtpStatus('verified')
      setOtpMessage('Email verified. You can send the message now.')
      setVerifiedEmail(normalizedEmail)
      setVerificationCode('')
    } catch (error) {
      setOtpStatus('error')
      setOtpMessage(error instanceof Error ? error.message : 'Failed to verify the code.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage('')

    if (!isEmailValid(formState.email)) {
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
        body: JSON.stringify(formState),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to send')

      setSendStatus('success')
      setSubmitMessage('Your message was sent successfully.')
      setFormState({ name: '', email: '', subject: '', message: '' })
      setVerifiedEmail('')
      setOtpStatus('idle')
      setOtpMessage('')
    } catch (error) {
      setSendStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : 'Unable to send the message right now.')
    } finally {
      setSending(false)
      setTimeout(() => setSendStatus('idle'), 4000)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50, x: -30 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 50, x: 30 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const inputClasses = (field: string) =>
    `w-full bg-white/[0.03] border rounded-xl px-5 py-4 text-sm text-white placeholder-neutral-600 
     outline-none transition-all duration-300 backdrop-blur-sm
     ${focusedField === field ? 'border-cyan-400/50 bg-white/[0.05] shadow-[0_0_20px_rgba(0,212,255,0.05)]' : 'border-white/10 hover:border-white/20'}`

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-225 h-225 bg-cyan-500/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-100 h-100 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-20">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] text-neutral-500 mb-4 font-mono">
          Get In Touch
        </p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-green-400">
            Contact
          </span>
        </h2>
        <div className="mx-auto mt-6 h-0.5 w-24 bg-green-400" />
        <p className="mt-6 text-neutral-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Have a project in mind or want to collaborate? I&apos;d love to hear from you.
          Let&apos;s build something amazing together.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="lg:col-span-3 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className={inputClasses('name')}
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={inputClasses('email')}
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition-colors hover:border-cyan-300 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {otpStatus === 'sending' ? <Loader2 size={14} className="animate-spin" /> : null}
                  Send OTP
                </button>
                <span className="text-xs text-neutral-500">
                  {otpStatus === 'verified' && verifiedEmail === normalizedEmail ? 'Verified for this email.' : 'Request a code before submitting.'}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit verification code"
                  className={inputClasses('verificationCode')}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onFocus={() => setFocusedField('verificationCode')}
                  onBlur={() => setFocusedField(null)}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {otpStatus === 'verifying' ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Verify Code
                  </button>
                  {otpStatus === 'verified' && verifiedEmail === normalizedEmail ? (
                    <span className="inline-flex items-center gap-2 text-sm text-green-400">
                      <Check size={14} /> Email verified
                    </span>
                  ) : null}
                </div>
                {otpMessage ? (
                  <p
                    className={`text-xs ${otpStatus === 'error' ? 'text-red-400' : otpStatus === 'verified' ? 'text-green-400' : 'text-neutral-500'}`}
                  >
                    {otpMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
              Subject
            </label>
            <input
              type="text"
              placeholder="What's this about?"
              className={inputClasses('subject')}
              value={formState.subject}
              onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              onFocus={() => setFocusedField('subject')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              placeholder="Tell me about your project..."
              className={`${inputClasses('message')} resize-none`}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm
                       transition-all duration-300 active:scale-[0.98]
                       ${sendStatus === 'success' ? 'bg-green-500 text-black' : sendStatus === 'error' ? 'bg-red-500 text-white' : 'bg-green-400 text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]'}
                       ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>
              {sending
                ? 'Sending...'
                : sendStatus === 'success'
                ? 'Message Sent!'
                : sendStatus === 'error'
                ? 'Failed to Send'
                : 'Send Message'}
            </span>
            {sendStatus === 'success' ? (
              <Check size={16} />
            ) : (
              <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            )}
          </button>
          {submitMessage ? (
            <p className={`mt-3 text-sm ${sendStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {submitMessage}
            </p>
          ) : null}
        </form>

        {/* Info */}
        <div ref={infoRef} className="lg:col-span-2 space-y-8">
          {/* Email Card */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm group hover:border-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center">
                <Mail size={18} className="text-green-400" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Email</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-sm">mail@sushanka.com.np</p>
              <button
                onClick={copyEmail}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
                aria-label="Copy email"
              >
                {copied ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} className="text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Location Card */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm group hover:border-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <MapPin size={18} className="text-cyan-400" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Location</span>
            </div>
            <p className="text-white/80 text-sm">Nepal</p>
            <p className="text-neutral-500 text-xs mt-1">Available for remote work worldwide</p>
          </div>

          {/* Social Links */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-4">
              Connect
            </span>
            <div className="space-y-3">
              {[
                { name: 'GitHub', url: 'https://github.com/SUSHANK001-ops' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/lamichhane--68b754341/?skipRedirect=true' },
                    { name: 'Instagram ', url: 'https://www.instagram.com/the_sushank_lamichhane/' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 rounded-xl -mx-4
                             hover:bg-white/3 transition-all duration-300 group"
                >
                  <span className="text-sm text-neutral-400 group-hover:text-white transition-colors duration-300">
                    {social.name}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-neutral-600 group-hover:text-white transition-all duration-300 
                               group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
