'use client'
import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all hover:bg-foreground/8 hover:text-foreground active:scale-90"
      data-click-sound
    >
      <Sun
        size={15}
        className={`absolute transition-all duration-300 ${
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        size={15}
        className={`absolute transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}

export default ThemeToggle
