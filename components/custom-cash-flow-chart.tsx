"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TransactionDrawer } from "@/components/transaction-drawer"
import { AddTransactionDrawer } from "@/components/add-transaction-drawer"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from './theme-provider'

const colorSchemes = [
  {
    name: 'Modern Blue',
    background: '#f0f4f8',
    text: '#2d3748',
    primary: '#4299e1',
    secondary: '#ed64a6',
    accent: '#48bb78',
  },
  {
    name: 'Warm Sunset',
    background: '#fffaf0',
    text: '#2d3748',
    primary: '#ed8936',
    secondary: '#9f7aea',
    accent: '#38b2ac',
  },
  {
    name: 'Cool Mint',
    background: '#f0fff4',
    text: '#2d3748',
    primary: '#38b2ac',
    secondary: '#667eea',
    accent: '#f6ad55',
  },
]

interface DataPoint {
  date: string
  income: number
  expense: number
  balance: number
}

const generateTestData = (years: number): DataPoint[] => {
  const startDate = new Date(new Date().getFullYear(), 0, 1)
  const months = years * 12
  let balance = 0

  return Array.from({ length: months }, (_, i) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
    const income = Math.floor(Math.random() * 8000) + 8000
    const expense = Math.floor(Math.random() * 6000) + 4000
    balance += income - expense
    
    return {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      income,
      expense,
      balance
    }
  })
}


export function CustomCashFlowChart() {
  const [timeRange, setTimeRange] = useState<"3" | "6" | "10">("3")
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)
  const { currentScheme } = useTheme()

  const data = useMemo(() => generateTestData(parseInt(timeRange)), [timeRange])

  const maxValue = useMemo(() => Math.max(...data.map(d => Math.max(d.income, d.expense, d.balance))), [data])

  const handleMonthClick = useCallback((month: string) => {
    setSelectedMonth(month)
    setIsDrawerOpen(true)
  }, [])

  const formatMoney = useCallback((amount: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
  }, [])

  const renderChart = useCallback(() => {
    const width = 1000
    const height = 400
    const padding = { top: 20, right: 30, bottom: 30, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const xScale = (index: number) => (index / (data.length - 1)) * chartWidth + padding.left
    const yScale = (value: number) => chartHeight - (value / maxValue) * chartHeight + padding.top

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* X and Y axes */}
        <line x1={padding.left} y1={chartHeight + padding.top} x2={chartWidth + padding.left} y2={chartHeight + padding.top} stroke={currentScheme.text} />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight + padding.top} stroke={currentScheme.text} />

        {/* X-axis labels */}
        {(() => {
          const labelWidth = 70; // Estimated width of each label
          const availableWidth = chartWidth / data.length;
          const interval = Math.ceil(labelWidth / availableWidth);
          
          return data.map((d, i) => {
            if (i % interval === 0 || i === data.length - 1) {
              const date = new Date(d.date);
              return (
                <text
                  key={`x-label-${i}`}
                  x={xScale(i)}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`}
                </text>
              );
            }
            return null;
          });
        })()}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <text
            key={`y-label-${tick}`}
            x={padding.left - 10}
            y={yScale(maxValue * tick)}
            textAnchor="end"
            fontSize="12"
            dominantBaseline="middle"
          >
            {formatMoney(maxValue * tick).split('.')[0]}
          </text>
        ))}

        {/* Income bars */}
        {data.map((d, i) => (
          <motion.rect
            key={`income-${i}`}
            x={xScale(i) - 8}
            y={yScale(d.income)}
            width={8}
            height={chartHeight - yScale(d.income) + padding.top}
            fill={currentScheme.primary}
            initial={{ height: 0 }}
            animate={{ height: chartHeight - yScale(d.income) + padding.top }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Expense bars */}
        {data.map((d, i) => (
          <motion.rect
            key={`expense-${i}`}
            x={xScale(i)}
            y={yScale(d.expense)}
            width={8}
            height={chartHeight - yScale(d.expense) + padding.top}
            fill={currentScheme.secondary}
            initial={{ height: 0 }}
            animate={{ height: chartHeight - yScale(d.expense) + padding.top }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Balance line */}
        <motion.path
          d={`M${xScale(0)},${yScale(data[0].balance)} ${data.map((d, i) => `L${xScale(i)},${yScale(d.balance)}`).join(' ')}`}
          fill="none"
          stroke={currentScheme.accent}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Clickable areas and Hover effect */}
        {data.map((d, i) => {
          const x = i === 0 ? padding.left : xScale(i - 0.5);
          const width = i === data.length - 1 
            ? chartWidth + padding.left - x 
            : xScale(i + 0.5) - x;
          return (
            <g key={`month-${i}`}>
              <rect
                x={x}
                y={padding.top}
                width={width}
                height={chartHeight}
                fill={hoveredMonth === d.date ? "rgba(0,0,0,0.1)" : "transparent"}
                onMouseEnter={() => setHoveredMonth(d.date)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => handleMonthClick(d.date)}
                style={{ cursor: 'pointer' }}
              />
              {hoveredMonth === d.date && (
                <g>
                  <rect
                    x={xScale(i) + 10}
                    y={padding.top}
                    width={150}
                    height={80}
                    fill="white"
                    stroke="black"
                  />
                  <text x={xScale(i) + 20} y={padding.top + 20} fontSize="12">
                    {d.date}
                  </text>
                  <text x={xScale(i) + 20} y={padding.top + 40} fontSize="12" fill="#2563eb">
                    收入: {formatMoney(d.income)}
                  </text>
                  <text x={xScale(i) + 20} y={padding.top + 60} fontSize="12" fill="#dc2626">
                    支出: {formatMoney(d.expense)}
                  </text>
                  <text x={xScale(i) + 20} y={padding.top + 80} fontSize="12">
                    结余: {formatMoney(d.balance)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    )
  }, [data, maxValue, hoveredMonth, handleMonthClick, formatMoney, currentScheme])

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">现金流趋势</h2>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <Button 
              variant={timeRange === "3" ? "default" : "outline"}
              onClick={() => setTimeRange("3")}
              size="sm"
              className="rounded-none"
            >
              3年
            </Button>
            <Button
              variant={timeRange === "6" ? "default" : "outline"}
              onClick={() => setTimeRange("6")}
              size="sm"
              className="rounded-none"
            >
              6年
            </Button>
            <Button
              variant={timeRange === "10" ? "default" : "outline"}
              onClick={() => setTimeRange("10")}
              size="sm"
              className="rounded-none"
            >
              10年
            </Button>
          </div>
          <Button className="ml-4" variant="default" onClick={() => setIsAddDrawerOpen(true)}>
            添加收支
          </Button>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={timeRange}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderChart()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>收入</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span>支出</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent" />
          <span>结余趋势</span>
        </div>
      </div>

      <TransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedMonth={selectedMonth}
      />
      <AddTransactionDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
      />
    </Card>
  )
}

