'use client'

import React, { useState } from 'react'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

export function ChemicalTable({ chemicals, onRemoveChemical }) {
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil((chemicals?.length || 0) / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChemicals = chemicals?.slice(startIndex, endIndex)

  const columns = [
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <Button size='icon' variant='destructive' onClick={() => onRemoveChemical(row.original)}>
          <Trash2 className='h-4 w-4' />
        </Button>
      ),
    },
    {
      header: 'Chemical Name',
      accessorKey: 'name',
    },
    {
      header: 'CAS Number',
      accessorKey: 'cas_number',
    },
  ]

  return (
    <Card className='p-5 space-y-4'>
      <Table columns={columns} data={currentChemicals || []} />
      <div className='flex items-center justify-between mt-4'>
        <div className='text-sm text-gray-500'>
          Items per page:{' '}
          <Select
            value={itemsPerPage}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setPage(1)
            }}
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
            ]}
            className='w-20'
          />
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className='text-sm text-gray-500'>
            {startIndex + 1} - {Math.min(endIndex, chemicals?.length || 0)} of {chemicals?.length || 0}
          </span>
          <Button variant='outline' size='sm' onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}
