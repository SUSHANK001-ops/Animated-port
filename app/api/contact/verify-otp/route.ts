import { NextRequest, NextResponse } from 'next/server'

import {
  CONTACT_OTP_COOKIE,
  CONTACT_VERIFIED_COOKIE,
  createVerifiedToken,
  getVerifiedCookieOptions,
  matchesOtp,
  normalizeEmail,
  verifyOtpToken,
} from '@/lib/contactVerification'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

// Limit guesses so the 6-digit code can't be brute-forced.
const OTP_VERIFY_LIMIT = 6 // attempts per email...
const OTP_VERIFY_WINDOW = 10 * 60 // ...within 10 minutes (matches code lifetime)

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()
    const normalizedEmail = normalizeEmail(String(email ?? ''))
    const verificationCode = String(code ?? '').trim()

    if (!normalizedEmail || !verificationCode) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 })
    }

    const ip = getClientIp(req)
    const attempts = await rateLimit(
      'otp-verify',
      `${ip}:${normalizedEmail}`,
      OTP_VERIFY_LIMIT,
      OTP_VERIFY_WINDOW
    )
    if (!attempts.allowed) {
      return NextResponse.json(
        {
          error: `Too many attempts. Please request a new code and try again in ${Math.ceil(
            attempts.retryAfter / 60
          )} minute(s).`,
        },
        { status: 429, headers: { 'Retry-After': String(attempts.retryAfter) } }
      )
    }

    const otpToken = req.cookies.get(CONTACT_OTP_COOKIE)?.value

    if (!otpToken) {
      return NextResponse.json({ error: 'Request a new verification code first.' }, { status: 400 })
    }

    const challenge = verifyOtpToken(otpToken)

    if (!challenge || challenge.email !== normalizedEmail) {
      return NextResponse.json({ error: 'The code has expired or does not match this email.' }, { status: 400 })
    }

    if (!matchesOtp(normalizedEmail, verificationCode, challenge.otpHash)) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(CONTACT_OTP_COOKIE, '', { path: '/', maxAge: 0 })
    response.cookies.set(CONTACT_VERIFIED_COOKIE, createVerifiedToken(normalizedEmail), getVerifiedCookieOptions())

    return response
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify the code. Please try again later.' },
      { status: 500 }
    )
  }
}
