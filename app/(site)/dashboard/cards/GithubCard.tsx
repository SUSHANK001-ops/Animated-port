'use client'
import React, { useEffect, useState } from 'react'
import { Github } from 'lucide-react'

interface GithubData {
  publicRepos: number
  followers: number
  totalStars: number
  contributionsThisYear: number
  weeks: number[][]
}

function level(count: number): string {
  if (count === 0) return 'bg-border'
  if (count < 3) return 'bg-accent/30'
  if (count < 6) return 'bg-accent/60'
  return 'bg-accent'
}

const GithubCard = () => {
  const [data, setData] = useState<GithubData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/github')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true))
  }, [])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
      <div className="mb-5 flex items-center gap-2 text-muted">
        <Github size={16} />
        <span className="font-mono text-xs uppercase tracking-widest">GitHub Activity</span>
      </div>

      {error ? (
        <p className="text-sm text-muted">Couldn&apos;t load GitHub data right now.</p>
      ) : !data ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: data.contributionsThisYear, l: 'Commits (yr)' },
              { v: data.publicRepos, l: 'Repos' },
              { v: data.totalStars, l: 'Stars' },
              { v: data.followers, l: 'Followers' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold text-foreground">{s.v}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          {/* Contribution graph (last 12 weeks) */}
          {data.weeks.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                Last 12 weeks
              </p>
              <div className="flex gap-1">
                {data.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) => (
                      <span
                        key={di}
                        className={`h-2.5 w-2.5 rounded-[2px] ${level(day)}`}
                        title={`${day} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GithubCard
