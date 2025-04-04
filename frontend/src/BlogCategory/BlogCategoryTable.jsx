'use client'

import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from '@/slice/blog/blogCategory'

const BlogCategory = () => {
  const navigate = useNavigate()
  const { data: categories, error, isLoading, refetch } = useGetAllCategoriesQuery()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()


  useEffect(() => {
    refetch()
  }, [refetch])

  const handleEdit = (id) => {
    navigate(`/edit-blog-category-form/${id}`)
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap()
      toast({ title: 'Success', description: 'Category deleted successfully' })
      refetch()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' })
    }
  }

  if (isLoading) return <div className='flex justify-center p-5'>Loading...</div>
  if (error) return <div className='text-red-500'>Error: {error.message || 'An error occurred'}</div>

  const columns = [
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button size='icon' variant='outline' onClick={() => handleEdit(row.original._id)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size='icon' variant='destructive'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete this category?</DialogDescription>
              <div className='flex justify-end space-x-2'>
                <Button variant='outline'>Cancel</Button>
                <Button variant='destructive' onClick={() => handleDelete(row.original._id)}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
  ]

  return (
    <Card className='p-5 space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Blog Categories</h2>
        <Link to='/blog-category-form'>
          <Button>
            <Plus className='h-4 w-4 mr-2' /> Add Category
          </Button>
        </Link>
      </div>
      <Table columns={columns} data={categories || []} />
    </Card>
  )
}

export default BlogCategory
