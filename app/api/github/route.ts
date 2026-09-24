import { NextResponse } from 'next/server'
import { identity } from '@/data/config'

/**
 * GitHub stats + contribution graph for the dashboard.
 *
 * With a PAT (GITHUB_TOKEN) we use the GraphQL API for an accurate
 * contribution calendar + activity overview. Without one we fall back to the
 * public REST profile + a community contributions API.
 *
 * Response is cached for 1 hour.
 */
export const revalidate = 3600

const USER = identity.githubUsername
const TOKEN = process.env.GITHUB_TOKEN

function restHeaders() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-dashboard',
  }
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`
  return h
}

interface GraphResult {
  contributionsThisYear: number
  weeks: number[][]
  topRepos: { name: string; url: string }[]
}

/** GraphQL: accurate calendar + recently contributed repos. */
async function fetchGraph(): Promise<GraphResult | null> {
  if (!TOKEN) return null

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount } }
          }
          commitContributionsByRepository(maxRepositories: 5) {
            repository { name url }
          }
        }
      }
    }
  `

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-dashboard',
      },
      body: JSON.stringify({ query, variables: { login: USER } }),
      next: { revalidate },
    })
    if (!res.ok) return null

    const json = await res.json()
    const cc = json?.data?.user?.contributionsCollection
    const cal = cc?.contributionCalendar
    if (!cal) return null

    const weeks: number[][] = (cal.weeks ?? []).map(
      (w: { contributionDays: { contributionCount: number }[] }) =>
        w.contributionDays.map((d) => d.contributionCount)
    )

    const topRepos = (cc?.commitContributionsByRepository ?? [])
      .map((r: { repository: { name: string; url: string } }) => ({
        name: r.repository.name,
        url: r.repository.url,
      }))
      .slice(0, 5)

    return {
      contributionsThisYear: cal.totalContributions ?? 0,
      weeks,
      topRepos,
    }
  } catch {
    return null
  }
}

/** Public community API fallback for the calendar. */
async function fetchFallbackCalendar() {
  try {
    const year = new Date().getFullYear()
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${USER}?y=${year}`,
      { next: { revalidate } }
    )
    if (!res.ok) return { contributionsThisYear: 0, weeks: [] as number[][] }
    const contrib = await res.json()
    const days: Array<{ count: number }> = contrib?.contributions ?? []
    const total =
      contrib?.total?.[String(year)] ?? days.reduce((s, d) => s + (d.count || 0), 0)
    const weeks: number[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7).map((d) => d.count))
    }
    return { contributionsThisYear: total, weeks }
  } catch {
    return { contributionsThisYear: 0, weeks: [] as number[][] }
  }
}

export async function GET() {
  try {
    const [profileRes, graph] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, {
        headers: restHeaders(),
        next: { revalidate },
      }),
      fetchGraph(),
    ])

    if (!profileRes.ok) throw new Error(`GitHub profile fetch failed: ${profileRes.status}`)
    const profile = await profileRes.json()

    // Stars across public repos (best effort).
    let totalStars = 0
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${USER}/repos?per_page=100&type=owner`,
        { headers: restHeaders(), next: { revalidate } }
      )
      if (reposRes.ok) {
        const repos: Array<{ stargazers_count: number }> = await reposRes.json()
        totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      }
    } catch {
      /* best effort */
    }

    // Prefer GraphQL calendar; fall back to the community API.
    const cal = graph ?? (await fetchFallbackCalendar())
    const topRepos = graph?.topRepos ?? []

    return NextResponse.json({
      login: profile.login,
      name: profile.name ?? profile.login,
      publicRepos: profile.public_repos ?? 0,
      followers: profile.followers ?? 0,
      totalStars,
      contributionsThisYear: cal.contributionsThisYear,
      weeks: cal.weeks,
      topRepos,
      profileUrl: profile.html_url ?? `https://github.com/${USER}`,
    })
  } catch (error) {
    console.error('GitHub dashboard error:', error)
    return NextResponse.json({ error: 'Failed to load GitHub data.' }, { status: 502 })
  }
}
