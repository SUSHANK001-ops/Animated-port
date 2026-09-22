'use client'
import React from 'react'

/**
 * A small circular "stamp" badge with text running around its edge and a
 * mark in the middle. It spins slowly on its own and speeds up on hover —
 * the little detail that sits over the flower field, bottom-right.
 */
const SpinBadge = ({
  text = 'BUILT IN NEPAL · MADE WITH CARE · ',
  size = 88,
}: {
  text?: string
  size?: number
}) => {
  const id = React.useId().replace(/:/g, '')
  return (
    <div
      className="spin-badge grid place-items-center rounded-full"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <path
            id={`circle-${id}`}
            d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
            fill="none"
          />
        </defs>
        <circle cx="50" cy="50" r="48" fill="var(--surface)" stroke="var(--border)" />
        <circle cx="50" cy="50" r="15" fill="var(--c-purple)" opacity="0.9" />
        <text fontSize="9" letterSpacing="1.1" fill="var(--muted)" fontFamily="var(--font-jetbrains), monospace">
          <textPath href={`#circle-${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
        {/* little center mark */}
        <path
          d="M50 44 L53 50 L50 56 L47 50 Z"
          fill="var(--surface)"
        />
      </svg>
    </div>
  )
}

export default SpinBadge
