'use client'

import React from 'react'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Pencil } from 'lucide-react'
import { useGetEmailCategoriesQuery, useDeleteEmailCategoryMutation } from '@/slice/emailCategory/emailCategory'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { toast } from 'react-toastify'

const EmailCategoryTable = ({ onEditClick }) => {
  const { data: categories, isLoading } = useGetEmailCategoriesQuery()
  const [deleteCategory] = useDeleteEmailCategoryMutation()

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap()
      toast({ title: 'Success', description: 'Category deleted successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' })
    }
  }

  const columns = [
    {
      header: 'Category Name',
      accessorKey: 'emailCategory',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button size='icon' variant='secondary' onClick={() => onEditClick(row.original)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size='icon' variant='destructive'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                Are you sure you want to delete this category?
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original._id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  return (
    <Card className='p-5 space-y-4'>
      <Table columns={columns} data={categories || []} isLoading={isLoading} />
    </Card>
  )
}

export default EmailCategoryTable
