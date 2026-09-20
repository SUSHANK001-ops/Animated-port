import React from 'react'

interface StatBoxProps {
  value: string
  label: string
}

/**
 * nbnzia-style stat box: big number, small monospace label, bordered surface.
 */
const StatBox = ({ value, label }: StatBoxProps) => {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-5 md:p-6">
      <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
        {value}
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
    </div>
  )
}

export default StatBox
