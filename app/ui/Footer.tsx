'use client'
import React from 'react'
import Link from 'next/link'
import {
  User, LayoutDashboard, FileText, Sparkles,
  MessageSquare, Mail, BookOpen, Wrench,
  FolderGit2, Image as ImageIcon, MessageCircle, BarChart3,
  Instagram, Github, Linkedin, Rss,
} from 'lucide-react'
import { identity, nepaliQuote } from '@/data/config'
import FlowerField from './delight/FlowerField'
import NptClock from './delight/NptClock'

interface FLink {
  label: string
  href: string
  icon: React.ElementType
  external?: boolean
}

const columns: FLink[][] = [
  [
    { label: 'About', href: '/about', icon: User },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Certifications', href: '/certifications', icon: FileText },
    { label: 'Home', href: '/', icon: Sparkles },
  ],
  [
    { label: 'Guestbook', href: '/guestbook', icon: MessageSquare },
    { label: 'Contact', href: '/contact', icon: Mail },
    { label: 'Blog', href: '/blog', icon: BookOpen },
    { label: 'Projects', href: '/projects', icon: Wrench },
  ],
  [
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'GitHub', href: 'https://github.com/SUSHANK001-ops', icon: ImageIcon, external: true },
    { label: 'Feedback', href: '/guestbook', icon: MessageCircle },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  ],
  [
    { label: 'Instagram', href: 'https://www.instagram.com/the_sushank_lamichhane/', icon: Instagram, external: true },
    { label: 'Blog', href: identity.blogUrl, icon: Rss, external: true },
    { label: 'GitHub', href: 'https://github.com/SUSHANK001-ops', icon: Github, external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lamichhane--68b754341/', icon: Linkedin, external: true },
  ],
]

function FooterLink({ item }: { item: FLink }) {
  const Icon = item.icon
  const cls =
    'group inline-flex items-center gap-2 text-[0.82rem] text-muted transition-colors hover:text-foreground'
  const inner = (
    <>
      <Icon size={13} className="text-muted transition-colors group-hover:text-foreground" />
      <span className="link-quiet !text-muted group-hover:!text-foreground">{item.label}</span>
    </>
  )
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={cls}>
      {inner}
    </Link>
  )
}

const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="editorial-wide pt-16 pb-10">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
          {columns.map((col, i) => (
            <ul key={i} className="space-y-3">
              {col.map((item, j) => (
                <li key={`${i}-${j}`}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* Nepali quote */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="font-devanagari text-sm text-foreground/70">{nepaliQuote.text}</p>
          <p className="mt-1 text-xs text-muted">{nepaliQuote.translation}</p>
        </div>

        {/* Name + year · local time */}
        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono text-xs text-muted">
            {identity.name} &copy; {new Date().getFullYear()}
          </p>
          <NptClock variant="inline" />
        </div>
      </div>

      {/* Flowers + spinning badge */}
      <div className="relative">
        <FlowerField />
        <div className="pointer-events-none absolute bottom-3 right-4 z-10">
          <svg width="54" height="54" viewBox="0 0 100 100" className="spin-badge">
            <defs>
              <path id="badge-curve" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <circle cx="50" cy="50" r="48" fill="var(--c-purple)" />
            <text className="fill-white" style={{ fontSize: '11px', letterSpacing: '2px' }}>
              <textPath href="#badge-curve">
                · BUILT IN NEPAL · CRAFTED WITH CARE
              </textPath>
            </text>
            <circle cx="50" cy="50" r="12" fill="var(--surface)" />
          </svg>
        </div>
      </div>
    </footer>
  )
}

export default Footer
