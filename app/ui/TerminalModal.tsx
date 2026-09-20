'use client'
import React, { useEffect, useRef, useState } from 'react'
import { identity, projects, socials, techStack } from '@/data/config'

interface Line {
  type: 'input' | 'output'
  text: string
}

const HELP = `Available commands:
  whoami    who is this
  skills    tech stack
  projects  list projects
  contact   email & links
  clear     clear the screen
  help      show this help`

const BANNER = `Type a command and hit enter. 'help' for options, 'esc' to close.`

function runCommand(cmd: string): string {
  const c = cmd.trim().toLowerCase()
  switch (c) {
    case 'whoami':
      return `${identity.name}, ${identity.shortRole}`
    case 'skills':
      return techStack.join('  ·  ')
    case 'projects':
      return projects
        .map((p) => `[${p.number}] ${p.title}${p.liveUrl ? `  → ${p.liveUrl}` : ''}`)
        .join('\n')
    case 'contact':
      return [
        `email: ${identity.email}`,
        ...socials.map((s) => `${s.label.toLowerCase()}: ${s.url}`),
      ].join('\n')
    case 'help':
      return HELP
    case '':
      return ''
    default:
      return `command not found: ${c}. type 'help'.`
  }
}

const TerminalModal = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [lines, setLines] = useState<Line[]>([{ type: 'output', text: BANNER }])
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // Open with Ctrl+K or `/` (when not typing in a field); close with Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Focus the input when opened.
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Keep scrolled to the newest line.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = value
    if (cmd.trim().toLowerCase() === 'clear') {
      setLines([])
      setValue('')
      return
    }
    const out = runCommand(cmd)
    setLines((prev) => [
      ...prev,
      { type: 'input', text: cmd },
      ...(out ? [{ type: 'output' as const, text: out }] : []),
    ])
    setValue('')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-[#0d0d0d] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-accent/80" />
          <span className="ml-2 font-mono text-xs text-muted">
            {identity.handle}@portfolio ~ %
          </span>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="max-h-[50vh] overflow-y-auto px-4 py-3 font-mono text-sm text-accent"
        >
          {lines.map((line, i) => (
            <pre
              key={i}
              className="whitespace-pre-wrap break-words leading-relaxed"
            >
              {line.type === 'input' ? (
                <>
                  <span className="text-muted">$ </span>
                  <span className="text-foreground">{line.text}</span>
                </>
              ) : (
                line.text
              )}
            </pre>
          ))}

          {/* Prompt */}
          <form onSubmit={submit} className="mt-1 flex items-center gap-2">
            <span className="text-muted">$</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent text-foreground caret-accent outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default TerminalModal
