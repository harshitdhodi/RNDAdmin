'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import EmailCategoryTable from './EmailCategory'
import EmailCategoryForm from './emailCategoryForm'

const EmailCategoryParent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleAddNew = () => {
    setEditingCategory(null)
    setIsModalVisible(true)
  }

  const handleEditClick = (category) => {
    setEditingCategory(category)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setEditingCategory(null)
  }

  return (
    <Card className='p-5 space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Email Categories</h2>
        <Button onClick={handleAddNew}>
          <Plus className='h-4 w-4 mr-2' /> Add New Category
        </Button>
      </div>

      <EmailCategoryTable onEditClick={handleEditClick} />

      {isModalVisible && (
        <EmailCategoryForm
          visible={isModalVisible}
          onClose={handleModalClose}
          editingCategory={editingCategory}
        />
      )}
    </Card>
  )
}

export default EmailCategoryParent
