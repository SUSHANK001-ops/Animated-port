import { NextRequest } from 'next/server'

import connectDB from './db'
import RateLimitModel from '@/model/rateLimitModel'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  /** Seconds until the current window resets. */
  retryAfter: number
}

/**
 * Extract a best-effort client identifier from proxy headers.
 * Falls back to a constant so the limiter still applies when no IP is available.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for may be a comma-separated list; the first entry is the client.
    return forwarded.split(',')[0].trim()
  }

  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Fixed-window rate limiter backed by MongoDB.
 *
 * Uses a single atomic findOneAndUpdate with $inc so concurrent requests within
 * the same window cannot race past the limit. The window's expiry is only set
 * when the document is first created (via $setOnInsert), and MongoDB's TTL index
 * removes the document after it expires, which effectively resets the window.
 *
 * @param scope    Logical bucket name, e.g. "otp-send".
 * @param identifier  Caller identity, e.g. `${ip}:${email}`.
 * @param limit    Max allowed requests within the window.
 * @param windowSeconds  Window length in seconds.
 */
export async function rateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    await connectDB()

    const key = `${scope}:${identifier}`
    const now = Date.now()
    const expiresAt = new Date(now + windowSeconds * 1000)

    const doc = await RateLimitModel.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean<{ count: number; expiresAt: Date }>()

    const count = doc?.count ?? 1
    const windowEnd = doc?.expiresAt ? new Date(doc.expiresAt).getTime() : now + windowSeconds * 1000
    const retryAfter = Math.max(1, Math.ceil((windowEnd - now) / 1000))
    const allowed = count <= limit

    return {
      allowed,
      remaining: Math.max(0, limit - count),
      limit,
      retryAfter,
    }
  } catch (error) {
    // Fail open: if the datastore is unreachable, don't block legitimate users.
    // The OTP verification step still gates actual message delivery.
    console.error('Rate limit check failed:', error)
    return { allowed: true, remaining: limit, limit, retryAfter: 0 }
  }
}
