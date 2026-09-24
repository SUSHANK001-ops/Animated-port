import { NextResponse } from 'next/server'

/**
 * Public Umami stats for the dashboard.
 *
 * Uses the public *share* flow so no secret API key is needed:
 *   1. GET https://cloud.umami.is/api/share/<shareId>
 *      → { token, websiteId }   (token is a short-lived share token)
 *   2. GET /api/websites/<websiteId>/stats  with header
 *      `x-umami-share-token: <token>`
 *
 * Falls back to sensible placeholders if Umami is unreachable so the
 * dashboard never breaks.
 */

export const revalidate = 300 // cache upstream calls for 5 minutes

const UMAMI_HOST = 'https://cloud.umami.is'
const SHARE_ID = process.env.UMAMI_SHARE_ID || 'kraP5kOntalF4dZ3'

function humanize(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export async function GET() {
  try {
    // 1. Resolve the share token + website id.
    const shareRes = await fetch(`${UMAMI_HOST}/api/share/${SHARE_ID}`, {
      next: { revalidate },
    })
    if (!shareRes.ok) throw new Error(`share lookup failed (${shareRes.status})`)
    const share = (await shareRes.json()) as { token?: string; websiteId?: string }
    if (!share.token || !share.websiteId) throw new Error('share response missing token/websiteId')

    // 2. Fetch summary stats for the last 12 months (all-time-ish window).
    const endAt = Date.now()
    const startAt = endAt - 365 * 24 * 60 * 60 * 1000
    const statsUrl = new URL(`${UMAMI_HOST}/api/websites/${share.websiteId}/stats`)
    statsUrl.searchParams.set('startAt', String(startAt))
    statsUrl.searchParams.set('endAt', String(endAt))

    const statsRes = await fetch(statsUrl.toString(), {
      headers: { 'x-umami-share-token': share.token },
      next: { revalidate },
    })
    if (!statsRes.ok) throw new Error(`stats fetch failed (${statsRes.status})`)

    const stats = (await statsRes.json()) as {
      pageviews?: { value: number }
      visitors?: { value: number }
      visits?: { value: number }
    }

    // Umami returns { pageviews: { value, prev }, ... }; support both shapes.
    const pageviews =
      typeof stats.pageviews === 'object' ? stats.pageviews?.value : (stats.pageviews as unknown as number)
    const visitors =
      typeof stats.visitors === 'object' ? stats.visitors?.value : (stats.visitors as unknown as number)
    const visits =
      typeof stats.visits === 'object' ? stats.visits?.value : (stats.visits as unknown as number)

    return NextResponse.json({
      totalViews: humanize(pageviews ?? 0),
      uniqueVisitors: humanize(visitors ?? 0),
      totalVisits: humanize(visits ?? 0),
      shareUrl: `${UMAMI_HOST}/share/${SHARE_ID}`,
      ok: true,
    })
  } catch (error) {
    console.error('Umami stats error:', error)
    return NextResponse.json(
      {
        totalViews: '—',
        uniqueVisitors: '—',
        totalVisits: '—',
        shareUrl: `${UMAMI_HOST}/share/${SHARE_ID}`,
        ok: false,
      },
      { status: 200 }
    )
  }
}
