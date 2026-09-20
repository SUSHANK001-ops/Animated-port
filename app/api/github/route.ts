import { NextResponse } from 'next/server'
import { identity } from '@/data/config'

/**
 * GitHub stats + contribution graph for the dashboard.
 * All endpoints used here are public/unauthenticated:
 *   - https://api.github.com/users/:user            (profile: repos, followers)
 *   - https://api.github.com/users/:user/repos      (stars sum)
 *   - https://github-contributions-api.jogruber.de  (contribution calendar)
 *
 * Optionally set GITHUB_TOKEN to raise the rate limit (60/hr -> 5000/hr).
 * Response is cached for 1 hour.
 */
export const revalidate = 3600

const USER = identity.githubUsername

function headers() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-dashboard',
  }
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return h
}

export async function GET() {
  try {
    const year = new Date().getFullYear()

    const [profileRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, {
        headers: headers(),
        next: { revalidate },
      }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=${year}`, {
        next: { revalidate },
      }),
    ])

    if (!profileRes.ok) throw new Error(`GitHub profile fetch failed: ${profileRes.status}`)

    const profile = await profileRes.json()

    // Sum stars across public repos (first 100 is plenty here).
    let totalStars = 0
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${USER}/repos?per_page=100&type=owner`,
        { headers: headers(), next: { revalidate } }
      )
      if (reposRes.ok) {
        const repos: Array<{ stargazers_count: number }> = await reposRes.json()
        totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      }
    } catch {
      /* stars are best-effort */
    }

    // Contribution calendar -> last 12 weeks (84 days) of daily counts.
    let contributionsThisYear = 0
    let weeks: number[][] = []
    try {
      const contrib = await contribRes.json()
      const days: Array<{ count: number; date: string }> = contrib?.contributions ?? []
      contributionsThisYear =
        contrib?.total?.[String(year)] ??
        days.reduce((sum, d) => sum + (d.count || 0), 0)

      const last84 = days.slice(-84)
      for (let i = 0; i < last84.length; i += 7) {
        weeks.push(last84.slice(i, i + 7).map((d) => d.count))
      }
    } catch {
      weeks = []
    }

    return NextResponse.json({
      login: profile.login,
      publicRepos: profile.public_repos ?? 0,
      followers: profile.followers ?? 0,
      totalStars,
      contributionsThisYear,
      weeks,
    })
  } catch (error) {
    console.error('GitHub dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to load GitHub data.' },
      { status: 502 }
    )
  }
}
