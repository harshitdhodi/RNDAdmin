'use client'

import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from '@/slice/blog/blogCategory'

const CategoryRow = ({ item, level, refetch }) => {
  const navigate = useNavigate()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const handleEdit = () => {
    const editPath = `/edit-blog-category-form/${item._id}`
    navigate(editPath)
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(item._id).unwrap()
      // Trigger refetch to refresh data
      refetch()
      console.log('Category deleted successfully')
    } catch (error) {
      console.error('Failed to delete category', error)
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
          {item.category}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function BlogCategory() {
  const { data: categories, error, isLoading, refetch } = useGetAllCategoriesQuery()
  
  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>

  const categoriesArray = Array.isArray(categories) ? categories : [categories]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link to="/blog-category-form">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categories</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesArray.map((category) => (
              <CategoryRow 
                key={category._id} 
                item={category} 
                level={0} 
                refetch={refetch} 
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
