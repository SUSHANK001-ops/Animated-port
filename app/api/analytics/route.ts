import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

import connectDB from '@/lib/db'
import AnalyticsModel from '@/model/analyticsModel'
import { getClientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

function monthKey(d = new Date()) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Daily-stable, non-identifying visitor hash (IP + UA + date). */
function visitorHash(req: NextRequest) {
  const ip = getClientIp(req)
  const ua = req.headers.get('user-agent') ?? ''
  const day = new Date().toISOString().slice(0, 10)
  return crypto.createHash('sha256').update(`${ip}:${ua}:${day}`).digest('hex').slice(0, 16)
}

function humanize(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

/** POST — record a page view. Body: { path } */
export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json()
    const cleanPath = typeof path === 'string' && path.startsWith('/') ? path.slice(0, 120) : '/'
    const mk = monthKey()
    const visitor = visitorHash(req)

    await connectDB()

    // Increment views, and add the visitor to this month's set if new.
    await AnalyticsModel.updateOne(
      { path: cleanPath },
      {
        $inc: { views: 1 },
        $addToSet: { [`monthlyVisitors.${mk}`]: visitor },
      },
      { upsert: true }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

/** GET — aggregate stats for the dashboard. */
export async function GET() {
  try {
    await connectDB()
    const docs = await AnalyticsModel.find({}).lean()

    const mk = monthKey()
    let totalViews = 0
    const uniqueThisMonth = new Set<string>()
    let top = { path: '/', views: 0 }

    for (const d of docs) {
      totalViews += d.views || 0
      if (d.views > top.views) top = { path: d.path, views: d.views }

      // monthlyVisitors may come back as a plain object from lean().
      const mv = (d.monthlyVisitors ?? {}) as Record<string, string[]> | Map<string, string[]>
      const arr = mv instanceof Map ? mv.get(mk) : mv[mk]
      ;(arr ?? []).forEach((v) => uniqueThisMonth.add(v))
    }

    return NextResponse.json({
      totalViews: humanize(totalViews),
      uniqueVisitorsThisMonth: humanize(uniqueThisMonth.size),
      mostVisitedPage: top.path,
    })
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { totalViews: '—', uniqueVisitorsThisMonth: '—', mostVisitedPage: '—' },
      { status: 200 }
    )
  }
}
