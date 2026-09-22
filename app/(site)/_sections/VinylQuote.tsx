'use client'
import React from 'react'

/**
 * A music-note quote block with a spinning vinyl record — the little
 * personal beat on the homepage, echoing manishtamang.com's lyric card.
 */
const VinylQuote = () => {
  return (
    <div className="editorial-page">
      <div className="flex items-center justify-between gap-6 rounded-2xl border border-border bg-surface px-6 py-8">
        <blockquote className="max-w-md">
          <p className="font-devanagari text-lg leading-relaxed text-foreground md:text-xl">
            &ldquo;विद्या ददाति विनयम्&rdquo;
          </p>
          <p className="mt-3 text-sm italic text-muted">
            Knowledge gives humility — and the quiet confidence to keep
            shipping, one deploy at a time.
          </p>
        </blockquote>
        <div className="vinyl shrink-0" style={{ width: 96, height: 96 }} aria-hidden="true" />
      </div>
    </div>
  )
}

export default VinylQuote
