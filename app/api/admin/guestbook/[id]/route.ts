import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import GuestbookModel from '@/model/guestbookModel'
import cloudinary from '@/lib/cloudinary'
import { requireAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/** Best-effort derive a cloudinary public_id from a stored secure URL. */
function publicIdFromUrl(url?: string): string | null {
  if (!url) return null
  // .../upload/v123456/guestbook/abc123.jpg  ->  guestbook/abc123
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/)
  return m ? m[1] : null
}

/** PATCH — admin toggles hide/show on ANY entry. Body: { isHidden: boolean } */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const isHidden = Boolean(body?.isHidden)

    await connectDB()
    const entry = await GuestbookModel.findByIdAndUpdate(
      id,
      { isHidden },
      { new: true }
    )
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, id, isHidden: entry.isHidden })
  } catch (error) {
    console.error('Admin guestbook PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update entry.' }, { status: 500 })
  }
}

/** DELETE — admin removes ANY entry from the DB and destroys its photo. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await connectDB()
    const entry = await GuestbookModel.findById(id)
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found.' }, { status: 404 })
    }

    // Remove the Cloudinary asset if there was an attached photo.
    const publicId = entry.imagePublicId || publicIdFromUrl(entry.image)
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
      } catch (err) {
        // Non-fatal: still delete the DB record even if the asset lingers.
        console.error('Cloudinary destroy failed:', err)
      }
    }

    await entry.deleteOne()
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Admin guestbook DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete entry.' }, { status: 500 })
  }
}
