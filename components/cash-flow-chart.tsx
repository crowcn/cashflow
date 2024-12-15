"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle, Line } from "recharts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TransactionDrawer } from "@/components/transaction-drawer"
import { AddTransactionDrawer } from "@/components/add-transaction-drawer.tsx"; // Import the new component

interface DataPoint {
  date: string
  income: number
  expense: number
  balance: number
}

const generateTestData = (): DataPoint[] => {
  const startDate = new Date(2021, 0, 1)
  const months = 36 // 3 years of data
  let balance = 0

  return Array.from({ length: months }, (_, i) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
    const income = Math.floor(Math.random() * 8000) + 8000 // Random income between 8000 and 16000
    const expense = Math.floor(Math.random() * 6000) + 4000 // Random expense between 4000 and 10000
    balance += income - expense
    
    return {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      income,
      expense,
      balance
    }
  })
}

const INITIAL_DATA = generateTestData()

export function CashFlowChart() {
  const [timeRange, setTimeRange] = useState<"3" | "6" | "10">("3")
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false) // Added state for add form drawer

  const filteredData = useMemo(() => {
    const yearsToShow = parseInt(timeRange)
    const monthsToShow = yearsToShow * 12
    return INITIAL_DATA.slice(0, monthsToShow)
  }, [timeRange])

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month)
    setIsDrawerOpen(true)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-blue-600">收入: ¥{payload[0]?.value.toLocaleString()}</p>
          <p className="text-red-600">支出: ¥{payload[1]?.value.toLocaleString()}</p>
          <p className="text-black">结余: ¥{payload[2]?.value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  const ClickableBackground = ({ x, y, width, height, payload }: any) => {
    if (!payload) return null
    const isHovered = payload.date === hoveredMonth

    return (
      <Rectangle
        x={x}
        y={0}
        width={width}
        height={400}
        fill={isHovered ? "rgba(0,0,0,0.05)" : "transparent"}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedMonth(payload.date);
          setIsDrawerOpen(true);
        }}
        style={{ cursor: 'pointer' }}
      />
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">现金流趋势</h2>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <Button 
              variant={timeRange === "3" ? "default" : "outline"}
              onClick={() => setTimeRange("3")}
            >
              3年
            </Button>
            <Button
              variant={timeRange === "6" ? "default" : "outline"}
              onClick={() => setTimeRange("6")}
            >
              6年
            </Button>
            <Button
              variant={timeRange === "10" ? "default" : "outline"}
              onClick={() => setTimeRange("10")}
            >
              10年
            </Button>
          </div>
          <Button className="ml-4" variant="default" onClick={() => setIsAddDrawerOpen(true)}> {/* Updated button */}
            添加收支
          </Button>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined && filteredData[state.activeTooltipIndex]) {
                setHoveredMonth(filteredData[state.activeTooltipIndex].date)
              }
            }}
            onMouseLeave={() => setHoveredMonth(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="income" 
              fill="#2563eb" 
              name="收入"
              yAxisId="left"
              isAnimationActive={false}
            />
            <Bar 
              dataKey="expense" 
              fill="#dc2626" 
              name="支出"
              yAxisId="left"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
              name="结余趋势"
              yAxisId="right"
              isAnimationActive={false}
            />
            {filteredData.map((entry, index) => (
              <ClickableBackground
                key={`bg-${index}`}
                payload={entry}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>收入</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded" />
          <span>支出</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded" />
          <span>结余趋势</span>
        </div>
      </div>

      <TransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedMonth={selectedMonth}
      />
      <AddTransactionDrawer // Added AddTransactionDrawer component
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
      />
    </Card>
  )
}

