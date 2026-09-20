import { NextRequest, NextResponse } from 'next/server'

import connectDB from '@/lib/db'
import GuestbookModel from '@/model/guestbookModel'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

// Max signings per IP within the window (anti-spam).
const SIGN_LIMIT = 3
const SIGN_WINDOW = 60 * 60 // 1 hour

function sanitize(value: string) {
  // Collapse control chars / excessive whitespace; trim.
  return value.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim()
}

/** GET — newest messages first. */
export async function GET() {
  try {
    await connectDB()
    const entries = await GuestbookModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .select('name message createdAt')
      .lean()

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Guestbook GET error:', error)
    return NextResponse.json({ error: 'Failed to load messages.' }, { status: 500 })
  }
}

/** POST — add a message. Honeypot + IP rate limit for spam protection. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = sanitize(String(body?.name ?? ''))
    const message = sanitize(String(body?.message ?? ''))
    // Honeypot: bots fill hidden fields. Humans leave it empty.
    const honeypot = String(body?.website ?? '')

    if (honeypot.trim() !== '') {
      // Pretend success so bots don't learn they were blocked.
      return NextResponse.json({ success: true })
    }

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required.' },
        { status: 400 }
      )
    }
    if (name.length > 60) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
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

    await connectDB()
    const entry = await GuestbookModel.create({ name, message })

    return NextResponse.json({
      success: true,
      entry: {
        _id: entry._id,
        name: entry.name,
        message: entry.message,
        createdAt: entry.createdAt,
      },
    })
  } catch (error) {
    console.error('Guestbook POST error:', error)
    return NextResponse.json({ error: 'Failed to post message.' }, { status: 500 })
  }
}
