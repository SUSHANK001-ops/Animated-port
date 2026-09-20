'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { identity } from '@/data/config'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Blog', href: identity.blogUrl, external: true },
  { label: 'Contact', href: '/contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? 'border-border bg-background/70 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link href="/" className="group font-mono text-lg font-semibold text-foreground">
          {identity.handle}
          <span className="cursor-blink ml-0.5 align-middle">&nbsp;</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = !link.external && pathname === link.href
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`text-sm transition-colors hover:text-foreground ${
                    active ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(true)}
          className="text-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile slide-in sheet */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-72 border-l border-border bg-surface p-6 transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <span className="font-mono text-lg font-semibold text-foreground">
              {identity.handle}
              <span className="cursor-blink ml-0.5 align-middle">&nbsp;</span>
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} className="text-foreground" />
            </button>
          </div>
          <ul className="flex flex-col gap-5">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="font-mono text-lg text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </header>
  )
}

export default Navbar
