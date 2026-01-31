import React from 'react'
import { Button } from "@/components/ui/button"

export function Pagination() {
  return (
    <div className="flex justify-end mt-4">
      <nav className="flex space-x-1" aria-label="Pagination">
        <Button
          variant="outline"
          size="sm"
          className="min-w-[40px] bg-yellow-600 text-white hover:bg-yellow-700"
        >
          1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-w-[40px] hover:bg-yellow-50"
        >
          2
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="min-w-[40px] hover:bg-yellow-50"
        >
          3
        </Button>
      </nav>
    </div>
  )
}

