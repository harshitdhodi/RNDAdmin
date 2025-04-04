'use client'

import React, { useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { useToast } from 'react-toastify'
import { useCreateEmailCategoryMutation, useUpdateEmailCategoryMutation } from '@/slice/emailCategory/emailCategory'
import { useForm } from 'react-hook-form'

const EmailCategoryForm = ({ visible, onClose, editingCategory }) => {

  const [createCategory] = useCreateEmailCategoryMutation()
  const [updateCategory] = useUpdateEmailCategoryMutation()
  const form = useForm({
    defaultValues: { emailCategory: editingCategory?.emailCategory || '' },
  })

  useEffect(() => {
    form.reset({ emailCategory: editingCategory?.emailCategory || '' })
  }, [editingCategory, form])

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, data: values }).unwrap()
        toast({ title: 'Success', description: 'Category updated successfully' })
      } else {
        await createCategory(values).unwrap()
        toast({ title: 'Success', description: 'Category created successfully' })
      }
      onClose()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='emailCategory'
              rules={{ required: 'Please enter category name' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter category name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='secondary' onClick={onClose}>Cancel</Button>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EmailCategoryForm
