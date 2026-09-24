/**
 * ============================================================================
 *  Spotify refresh-token generator (one-time helper).
 * ============================================================================
 *
 *  Client ID + Secret alone CANNOT read your personal "now playing" data.
 *  Spotify requires a user-authorized refresh token, obtained once via the
 *  Authorization Code flow. This script does that for you.
 *
 *  PREREQUISITES
 *  1. Open https://developer.spotify.com/dashboard  ->  your app  ->  Settings.
 *  2. Under "Redirect URIs" add EXACTLY:  http://127.0.0.1:8888/callback
 *     (Spotify no longer accepts "localhost" — use 127.0.0.1.)
 *  3. Make sure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are set in .env.
 *
 *  RUN
 *      node scripts/spotify-token.mjs
 *
 *  It opens (or prints) a Spotify consent URL. Approve it, and the script
 *  prints your SPOTIFY_REFRESH_TOKEN. Paste that value into .env.
 * ============================================================================
 */

import http from 'node:http'
import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Minimal .env loader (no dependency needed) ----------------------------
function loadEnv() {
  try {
    const raw = readFileSync(path.join(__dirname, '..', '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {
    /* .env optional if vars already exported */
  }
}
loadEnv()

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const PORT = 8888
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`
const SCOPE = 'user-read-currently-playing user-read-recently-played user-read-playback-state'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n✗ SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET missing in .env\n')
  process.exit(1)
}

const state = crypto.randomBytes(8).toString('hex')
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state,
  }).toString()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  if (url.pathname !== '/callback') {
    res.writeHead(404).end('Not found')
    return
  }

  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const err = url.searchParams.get('error')

  if (err || !code || returnedState !== state) {
    res.writeHead(400, { 'Content-Type': 'text/html' })
    res.end(`<h2>Authorization failed: ${err || 'invalid state/code'}</h2>`)
    console.error('\n✗ Authorization failed:', err || 'invalid state/code', '\n')
    server.close()
    return
  }

  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })
    const data = await tokenRes.json()

    if (!tokenRes.ok || !data.refresh_token) {
      throw new Error(JSON.stringify(data))
    }

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(
      '<h2 style="font-family:system-ui">✅ Success — refresh token generated.</h2>' +
        '<p style="font-family:system-ui">Copy it from your terminal into <code>.env</code>, then close this tab.</p>'
    )

    console.log('\n============================================================')
    console.log('  ✅ Add this line to your .env (replace the old value):')
    console.log('============================================================\n')
    console.log(`SPOTIFY_REFRESH_TOKEN="${data.refresh_token}"\n`)
    console.log('============================================================\n')
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html' })
    res.end('<h2>Token exchange failed. Check the terminal.</h2>')
    console.error('\n✗ Token exchange failed:', e, '\n')
  } finally {
    server.close()
  }
})

server.listen(PORT, () => {
  console.log('\nSpotify token helper listening on', REDIRECT_URI)
  console.log('\n1. Ensure this redirect URI is registered in your Spotify app settings:')
  console.log('   ', REDIRECT_URI)
  console.log('\n2. Open this URL in your browser and approve access:\n')
  console.log('   ' + authUrl + '\n')
})
