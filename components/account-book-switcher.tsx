import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AccountBook {
  id: string
  name: string
}

interface AccountBookSwitcherProps {
  isOpen: boolean
  onClose: () => void
}

export function AccountBookSwitcher({ isOpen, onClose }: AccountBookSwitcherProps) {
  // This is a mock list of account books. In a real application, you'd fetch this from your backend.
  const [accountBooks, setAccountBooks] = useState<AccountBook[]>([
    { id: '1', name: '个人账本' },
    { id: '2', name: '家庭账本' },
    { id: '3', name: '公司账本' },
  ])

  const handleSwitchAccountBook = (id: string) => {
    // Here you would implement the logic to switch to the selected account book
    console.log(`Switching to account book with id: ${id}`)
    onClose()
  }

  const handleCreateNewAccountBook = () => {
    // Here you would implement the logic to create a new account book
    const newId = (accountBooks.length + 1).toString()
    const newAccountBook = { id: newId, name: `新账本 ${newId}` }
    setAccountBooks([...accountBooks, newAccountBook])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>切换账本</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {accountBooks.map((book) => (
            <Button
              key={book.id}
              variant="outline"
              onClick={() => handleSwitchAccountBook(book.id)}
              className="justify-start"
            >
              {book.name}
            </Button>
          ))}
          <Button onClick={handleCreateNewAccountBook} className="mt-2">
            新建账本
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

