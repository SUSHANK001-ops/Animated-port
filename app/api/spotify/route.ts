import { NextResponse } from 'next/server'

/**
 * ============================================================================
 *  Spotify "Now Playing" — dashboard widget.
 * ============================================================================
 *
 *  SETUP (one-time):
 *  1. Create an app at https://developer.spotify.com/dashboard
 *     Add redirect URI: http://localhost:3000/callback
 *  2. Grab the Client ID and Client Secret.
 *  3. Get a refresh token with the `user-read-currently-playing` and
 *     `user-read-recently-played` scopes (use the auth-code flow once).
 *  4. Add these to your environment (.env.local / Vercel project settings):
 *        SPOTIFY_CLIENT_ID=...
 *        SPOTIFY_CLIENT_SECRET=...
 *        SPOTIFY_REFRESH_TOKEN=...
 *
 *  Until those are set, this route returns { configured: false } and the
 *  dashboard card shows a graceful "Not currently playing" fallback.
 * ============================================================================
 */

export const revalidate = 0 // always fresh — it's "now playing"

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

interface SpotifyTrack {
  name: string
  artist: string
  albumArt: string | null
  url: string | null
}

async function getAccessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.access_token ?? null
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapTrack(item: any): SpotifyTrack {
  return {
    name: item?.name ?? 'Unknown',
    artist: (item?.artists ?? []).map((a: any) => a.name).join(', ') || 'Unknown',
    albumArt: item?.album?.images?.[0]?.url ?? null,
    url: item?.external_urls?.spotify ?? null,
  }
}

export async function GET() {
  const token = await getAccessToken()
  if (!token) {
    return NextResponse.json({ configured: false, isPlaying: false })
  }

  try {
    // Currently playing?
    const nowRes = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (nowRes.status === 200) {
      const data = await nowRes.json()
      if (data?.item) {
        return NextResponse.json({
          configured: true,
          isPlaying: Boolean(data.is_playing),
          track: mapTrack(data.item),
        })
      }
    }

    // Fall back to the most recently played track.
    const recentRes = await fetch(RECENT_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (recentRes.ok) {
      const data = await recentRes.json()
      const item = data?.items?.[0]?.track
      if (item) {
        return NextResponse.json({
          configured: true,
          isPlaying: false,
          track: mapTrack(item),
        })
      }
    }

    return NextResponse.json({ configured: true, isPlaying: false })
  } catch (error) {
    console.error('Spotify dashboard error:', error)
    return NextResponse.json({ configured: true, isPlaying: false })
  }
}
