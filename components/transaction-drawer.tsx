"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
}

interface TransactionDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedMonth: string | null
}

const generateTestTransactions = (month: string): Transaction[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${month}-${i}`,
    type: Math.random() > 0.5 ? "income" : "expense",
    amount: Math.floor(Math.random() * 10000) + 1000,
    description: Math.random() > 0.5 ? "工资" : "日常开支",
    date: `${month}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  }))
}

export function TransactionDrawer({ isOpen, onClose, selectedMonth }: TransactionDrawerProps) {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && selectedMonth) {
      setLoading(true)
      // 模拟API调用
      setTimeout(() => {
        setTransactions(generateTestTransactions(selectedMonth))
        setLoading(false)
      }, 800)
    } else {
      setTransactions(null)
    }
  }, [isOpen, selectedMonth])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{selectedMonth ? `${selectedMonth} 流水数据` : "流水数据"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-8 w-[60px]" />
              </div>
            ))
          ) : (
            transactions?.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between space-x-4 p-4 border rounded-lg hover:bg-muted/50"
              >
                <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                  {transaction.type === "income" ? "收入" : "支出"}
                </span>
                <span className="font-medium">¥{transaction.amount.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{transaction.description}</span>
                <Button variant="outline" size="sm">
                  修改
                </Button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

