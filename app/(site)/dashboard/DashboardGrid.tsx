'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  BarChart3,
  Wrench,
  Award,
  FileText,
  GraduationCap,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import {
  analytics,
  dailyTools,
  certifications,
  latestBlogFallback,
  currentlyLearning,
} from '@/data/config'
import GithubCard from './cards/GithubCard'
import SpotifyCard from './cards/SpotifyCard'
import ClockCard from './cards/ClockCard'
import { useGsapReveal } from '../../ui/useGsapReveal'

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface LiveAnalytics {
  totalViews: string
  uniqueVisitorsThisMonth: string
  mostVisitedPage: string
}

interface LatestPost {
  title: string
  date: string
  excerpt: string
  href: string
  external: boolean
}

const DashboardGrid = () => {
  const gridRef = useGsapReveal<HTMLDivElement>({ stagger: 0.08, y: 24 })
  const { data: session } = useSession()
  const isAdmin = Boolean(session?.user?.isAdmin)

  // Live analytics from MongoDB, falling back to config defaults.
  const [stats, setStats] = useState<LiveAnalytics>(analytics)
  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.totalViews) setStats(d)
      })
      .catch(() => {})
  }, [])

  // Latest post from this site's own blog (MongoDB), fallback to config.
  const [latest, setLatest] = useState<LatestPost>({
    title: latestBlogFallback.title,
    date: latestBlogFallback.date,
    excerpt: latestBlogFallback.excerpt,
    href: latestBlogFallback.url,
    external: true,
  })
  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((d) => {
        const post = d?.blogs?.[0]
        if (post) {
          setLatest({
            title: post.title,
            date: post.dateposted,
            excerpt: post.Titledescription ?? '',
            href: `/blog/${post.slug}`,
            external: false,
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Admin Panel button — only for allowlisted admin emails. */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/dashboard"
            data-click-sound
            className="pop-btn inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
          >
            <ShieldCheck size={15} /> Admin Panel
          </Link>
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
      {/* Card 1 — GitHub (2 cols) */}
      <div className="md:col-span-2">
        <GithubCard />
      </div>

      {/* Card 3 — Clock (2 cols) */}
      <div className="md:col-span-2">
        <ClockCard />
      </div>

      {/* Card 2 — Spotify */}
      <div className="md:col-span-2 lg:col-span-1">
        <SpotifyCard />
      </div>

      {/* Card 5 — Tech stack daily */}
      <div className="rounded-2xl border border-border bg-surface p-6 md:col-span-2 lg:col-span-1">
        <div className="mb-5 flex items-center gap-2 text-muted">
          <Wrench size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">Daily Tools</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {dailyTools.map((tool) => (
            <span
              key={tool}
              className="rounded-lg border border-border px-2.5 py-1 font-mono text-xs text-foreground/80"
              title={tool}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Card 6 — Certifications quick view */}
      <div className="rounded-2xl border border-border bg-surface p-6 md:col-span-2 lg:col-span-1">
        <div className="mb-5 flex items-center gap-2 text-muted">
          <Award size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">Certifications</span>
        </div>
        <ul className="space-y-3">
          {certifications.slice(0, 3).map((c) => (
            <li key={c.name}>
              <p className="text-sm font-medium text-foreground">{c.name}</p>
              <p className="font-mono text-xs text-muted">{c.issuer}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/certifications"
          className="mt-4 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Card 7 — Latest blog post */}
      <div className="rounded-2xl border border-border bg-surface p-6 md:col-span-2 lg:col-span-1">
        <div className="mb-5 flex items-center gap-2 text-muted">
          <FileText size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">Latest Post</span>
        </div>
        <p className="text-sm font-semibold text-foreground">{latest.title}</p>
        <p className="mt-1 font-mono text-xs text-muted">{formatDate(latest.date)}</p>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">{latest.excerpt}</p>
        {latest.external ? (
          <a
            href={latest.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            Read <ArrowUpRight size={12} />
          </a>
        ) : (
          <Link
            href={latest.href}
            className="mt-4 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            Read <ArrowUpRight size={12} />
          </Link>
        )}
      </div>

      {/* Card 8 — Currently learning */}
      <div className="flex flex-col justify-center rounded-2xl border border-border bg-surface p-6 md:col-span-2 lg:col-span-1">
        <div className="mb-3 flex items-center gap-2 text-muted">
          <GraduationCap size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">Currently Learning</span>
        </div>
        <p className="text-lg font-bold leading-snug text-accent">{currentlyLearning}</p>
      </div>

      {/* Card 4 — Analytics (full width) */}
      <div className="rounded-2xl border border-border bg-surface p-6 md:col-span-2">
        <div className="mb-5 flex items-center gap-2 text-muted">
          <BarChart3 size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">Site Analytics</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-extrabold text-foreground">{stats.totalViews}</p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Total Views</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground">
              {stats.uniqueVisitorsThisMonth}
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Unique / Month
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-foreground">{stats.mostVisitedPage}</p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Most Visited
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default DashboardGrid
