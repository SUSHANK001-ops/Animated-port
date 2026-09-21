import { NextRequest, NextResponse } from 'next/server'

import connectDB from '@/lib/db'
import GuestbookModel from '@/model/guestbookModel'
import { getClientIp, rateLimit } from '@/lib/rateLimit'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

// Max signings per IP within the window (anti-spam, on top of auth).
const SIGN_LIMIT = 3
const SIGN_WINDOW = 60 * 60 // 1 hour

function sanitize(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim()
}

/** GET — newest messages first. */
export async function GET() {
  try {
    await connectDB()
    const entries = await GuestbookModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .select('name message avatar provider createdAt')
      .lean()

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Guestbook GET error:', error)
    return NextResponse.json({ error: 'Failed to load messages.' }, { status: 500 })
  }
}

/** POST — add a message. Requires an authenticated session (Google/GitHub). */
export async function POST(req: NextRequest) {
  try {
    // Must be signed in.
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to leave a message.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const message = sanitize(String(body?.message ?? ''))
    const honeypot = String(body?.website ?? '')

    // Honeypot: bots fill hidden fields; pretend success so they don't learn.
    if (honeypot.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }
    if (message.length > 500) {
      return NextResponse.json({ error: 'Message is too long (max 500).' }, { status: 400 })
    }

    // Rate limit by client IP.
    const ip = getClientIp(req)
    const rl = await rateLimit('guestbook', ip, SIGN_LIMIT, SIGN_WINDOW)
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `You're posting too frequently. Try again in ${Math.ceil(
            rl.retryAfter / 60
          )} minute(s).`,
        },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    // Identity comes from the verified session, never from the client.
    const name = sanitize(session.user.name ?? 'Anonymous').slice(0, 60) || 'Anonymous'
    const avatar = session.user.image ?? undefined
    const userId = session.user.id ?? session.user.email ?? undefined

    await connectDB()
    const entry = await GuestbookModel.create({ name, message, avatar, userId })

    return NextResponse.json({
      success: true,
      entry: {
        _id: entry._id,
        name: entry.name,
        message: entry.message,
        avatar: entry.avatar,
        createdAt: entry.createdAt,
      },
    })
  } catch (error) {
    console.error('Guestbook POST error:', error)
    return NextResponse.json({ error: 'Failed to post message.' }, { status: 500 })
  }
}
