"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme, colorSchemes } from './theme-provider'
import { Palette } from 'lucide-react'

export const ThemeSwitcher: React.FC = () => {
  const { currentScheme, setScheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">选择主题</h4>
          <div className="grid gap-2">
            {colorSchemes.map((scheme) => (
              <Button
                key={scheme.name}
                variant={currentScheme.name === scheme.name ? "default" : "outline"}
                className="justify-start"
                onClick={() => setScheme(scheme)}
              >
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: scheme.primary }} />
                {scheme.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

