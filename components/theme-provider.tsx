"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { generateAccessibleColorScheme } from '@/lib/color-utils'

const baseColorSchemes = [
  {
    name: '默认配色',
    background: '#ffffff',
    text: '#333333',
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    muted: '#f3f4f6',
  },
  {
    name: '暗夜模式',
    background: '#1f2937',
    text: '#f3f4f6',
    primary: '#60a5fa',
    secondary: '#34d399',
    accent: '#a78bfa',
    muted: '#374151',
  },
  {
    name: '柔和粉彩',
    background: '#fdf2f8',
    text: '#4b5563',
    primary: '#ec4899',
    secondary: '#14b8a6',
    accent: '#8b5cf6',
    muted: '#fce7f3',
  },
  {
    name: '自然绿意',
    background: '#ecfdf5',
    text: '#1f2937',
    primary: '#10b981',
    secondary: '#6366f1',
    accent: '#f59e0b',
    muted: '#d1fae5',
  },
]

export const colorSchemes = baseColorSchemes.map(scheme => ({
  ...scheme,
  ...generateAccessibleColorScheme(scheme)
}))

type ColorScheme = typeof colorSchemes[0]

interface ThemeContextType {
  currentScheme: ColorScheme
  setScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScheme, setCurrentScheme] = useState(colorSchemes[0])

  useEffect(() => {
    document.body.style.setProperty('--background', currentScheme.background)
    document.body.style.setProperty('--text', currentScheme.text)
    document.body.style.setProperty('--primary', currentScheme.primary)
    document.body.style.setProperty('--secondary', currentScheme.secondary)
    document.body.style.setProperty('--accent', currentScheme.accent)
    document.body.style.setProperty('--muted', currentScheme.muted)
  }, [currentScheme])

  return (
    <ThemeContext.Provider value={{ currentScheme, setScheme: setCurrentScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

