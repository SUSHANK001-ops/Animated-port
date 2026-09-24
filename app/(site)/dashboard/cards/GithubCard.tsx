'use client'
import React, { useEffect, useState } from 'react'
import { Github, ArrowUpRight } from 'lucide-react'

interface GithubData {
  login: string
  name: string
  publicRepos: number
  followers: number
  totalStars: number
  contributionsThisYear: number
  weeks: number[][]
  topRepos: { name: string; url: string }[]
  profileUrl: string
}

function level(count: number): string {
  if (count === 0) return 'bg-border'
  if (count < 3) return 'bg-c-green/35'
  if (count < 6) return 'bg-c-green/65'
  return 'bg-c-green'
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
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted">
          <Github size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">GitHub Activity</span>
        </div>
        {data && (
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            @{data.login} <ArrowUpRight size={12} />
          </a>
        )}
      </div>

      {error ? (
        <p className="text-sm text-muted">Couldn&apos;t load GitHub data right now.</p>
      ) : !data ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          {/* Headline: contributions in the last year */}
          <p className="text-3xl font-extrabold text-foreground">
            {data.contributionsThisYear.toLocaleString()}
          </p>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-muted">
            contributions in the last year
          </p>

          {/* Full-year contribution graph */}
          {data.weeks.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-[3px]">
                {data.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
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
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
                <span>Less</span>
                <span className="h-2.5 w-2.5 rounded-[2px] bg-border" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-c-green/35" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-c-green/65" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-c-green" />
                <span>More</span>
              </div>
            </div>
          )}

          {/* Stats + activity overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="grid grid-cols-3 gap-4">
              {[
                { v: data.publicRepos, l: 'Repos' },
                { v: data.totalStars, l: 'Stars' },
                { v: data.followers, l: 'Followers' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-xl font-extrabold text-foreground">{s.v}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            {data.topRepos.length > 0 && (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                  Recently active in
                </p>
                <ul className="space-y-1">
                  {data.topRepos.slice(0, 3).map((r) => (
                    <li key={r.name}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-link transition-opacity hover:opacity-80"
                      >
                        {r.name}
                        <ArrowUpRight size={11} className="text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default GithubCard
