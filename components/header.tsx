"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AccountBookSwitcher } from './account-book-switcher'

export function Header() {
  const pathname = usePathname()
  const [isAccountBookSwitcherOpen, setIsAccountBookSwitcherOpen] = useState(false)
  return (
    <div className="flex justify-between items-center h-16 px-4 border-b">
      <div className="flex gap-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block font-bold">现金流预测</span>
            <button
              onClick={() => setIsAccountBookSwitcherOpen(true)}
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              切换账本
            </button>
          </div>
        </Link>
        </div>
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <Link
            href="/"
            className={cn(
              "flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors",
              pathname === "/" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
          >
            趋势图
          </Link>
          <Link
            href="/transactions"
            className={cn(
              "flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors",
              pathname === "/transactions" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
          >
            流水数据
          </Link>
          <Link
            href="/manage"
            className={cn(
              "flex items-center text-sm font-medium px-3 py-2 rounded-md transition-colors",
              pathname === "/manage" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
          >
            收支管理
          </Link>
        </nav>
        <ThemeSwitcher />
      </div>
      <AccountBookSwitcher
        isOpen={isAccountBookSwitcherOpen}
        onClose={() => setIsAccountBookSwitcherOpen(false)}
      />
    </div>
  )
}

