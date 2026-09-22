'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './theme/ThemeToggle'
import SoundToggle from './sound/SoundToggle'

// Order + labels mirror manishtamang.com's floating pill nav.
const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Contact', href: '/contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 md:top-4">
      {/* Desktop floating pill */}
      <nav
        className={`nav-pill pointer-events-auto hidden items-center gap-1 px-2 py-1.5 md:flex ${
          scrolled ? 'scrolled' : ''
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            data-click-sound
            data-active={isActive(link.href)}
            className="nav-link"
          >
            {link.label}
          </Link>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <div className="flex items-center gap-0.5 pr-1">
          <ThemeToggle />
          <SoundToggle />
        </div>
      </nav>

      {/* Mobile floating pill */}
      <nav
        className={`nav-pill pointer-events-auto flex w-full max-w-md items-center justify-between px-4 py-2 md:hidden ${
          scrolled ? 'scrolled' : ''
        }`}
      >
        <Link
          href="/"
          data-click-sound
          className="font-serif text-base font-medium text-foreground"
        >
          Sushanka
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SoundToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-0.5 text-foreground transition-transform hover:scale-110 active:scale-95"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-in sheet */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 md:hidden ${
          open ? '!pointer-events-auto' : ''
        }`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-72 border-l border-border bg-surface p-6 transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-10 flex items-center justify-between">
            <span className="font-serif text-lg font-medium text-foreground">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} className="text-foreground" />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  data-click-sound
                  data-active={isActive(link.href)}
                  className="block rounded-lg px-3 py-2.5 text-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground data-[active=true]:text-foreground"
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
