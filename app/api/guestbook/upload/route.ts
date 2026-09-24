import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { auth } from '@/auth'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 4 * 1024 * 1024 // 4MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/** POST — upload a guestbook image. Requires a signed-in visitor session. */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Please sign in to upload an image.' }, { status: 401 })
    }

    // Light rate limit so nobody hammers the uploader.
    const ip = getClientIp(req)
    const rl = await rateLimit('guestbook-upload', ip, 12, 60 * 60)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image is too large (max 4MB).' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'guestbook',
      resource_type: 'image',
      transformation: [{ width: 1200, crop: 'limit' }],
    })

    return NextResponse.json(
      { url: result.secure_url, publicId: result.public_id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Guestbook upload error:', error)
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 })
  }
}
