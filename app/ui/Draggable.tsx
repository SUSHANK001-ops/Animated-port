'use client'
import React, { useRef, useState } from 'react'

interface DraggableProps {
  children: React.ReactNode
  className?: string
  /** Rotate slightly for a playful "stuck-on" look. */
  rotate?: number
}

/**
 * Pointer-based draggable wrapper — no library. The element can be dragged
 * anywhere within the viewport; it springs a subtle scale while held.
 * Respects reduced-motion by simply being draggable without extra flourish.
 */
const Draggable = ({ children, className = '', rotate = 0 }: DraggableProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, y: 0, px: 0, py: 0 })

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    start.current = { x: pos.x, y: pos.y, px: e.clientX, py: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - start.current.px
    const dy = e.clientY - start.current.py
    setPos({ x: start.current.x + dx, y: start.current.y + dy })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotate}deg) scale(${dragging ? 1.08 : 1})`,
        transition: dragging ? 'none' : 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        // Always float above sibling cards so it never hides beneath them.
        position: 'relative',
        zIndex: dragging ? 9999 : 30,
        willChange: 'transform',
      }}
      title="Drag me"
    >
      {children}
    </div>
  )
}

export default Draggable
