import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export const CONTACT_OTP_COOKIE = 'contact_email_otp'
export const CONTACT_VERIFIED_COOKIE = 'contact_email_verified'

const OTP_EXPIRY_SECONDS = 10 * 60
const VERIFIED_EXPIRY_SECONDS = 30 * 60

function getContactSecret() {
  const secret = process.env.JWT_SECRET || process.env.CONTACT_OTP_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return secret
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function generateOtpCode() {
  return crypto.randomInt(100000, 1000000).toString()
}

function hashOtp(email: string, code: string) {
  return crypto
    .createHash('sha256')
    .update(`${normalizeEmail(email)}:${code}`)
    .digest('hex')
}

export function createOtpToken(email: string, code: string) {
  return jwt.sign(
    { email: normalizeEmail(email), otpHash: hashOtp(email, code) },
    getContactSecret(),
    { expiresIn: `${OTP_EXPIRY_SECONDS}s` }
  )
}

export function verifyOtpToken(token: string) {
  try {
    return jwt.verify(token, getContactSecret()) as {
      email: string
      otpHash: string
    }
  } catch {
    return null
  }
}

export function createVerifiedToken(email: string) {
  return jwt.sign(
    { email: normalizeEmail(email), verified: true },
    getContactSecret(),
    { expiresIn: `${VERIFIED_EXPIRY_SECONDS}s` }
  )
}

export function verifyVerifiedToken(token: string) {
  try {
    return jwt.verify(token, getContactSecret()) as {
      email: string
      verified: true
    }
  } catch {
    return null
  }
}

export function matchesOtp(email: string, code: string, expectedHash: string) {
  const actualHash = hashOtp(email, code)

  if (actualHash.length !== expectedHash.length) {
    return false
  }

  return crypto.timingSafeEqual(
    Buffer.from(actualHash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  )
}

export function getOtpCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: OTP_EXPIRY_SECONDS,
  }
}

export function getVerifiedCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: VERIFIED_EXPIRY_SECONDS,
  }
}
