import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory'
import { useGetAllUnitsQuery } from '@/slice/chemicalUnit/unitSlice'
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export const CategorySelectionForm = ({ control, watch, setValue }) => {
  const [subCategories, setSubCategories] = useState([])
  const [subSubCategories, setSubSubCategories] = useState([])

  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllChemicalCategoriesQuery()
  const { data: unitsData, isLoading: unitsLoading } = useGetAllUnitsQuery()

  const watchCategory = watch('category')
  const watchSubCategory = watch('sub_category')
  const watchSubSubCategory = watch('subsub_category_id')

  const categories = categoriesData || []

  // Debug logging
  useEffect(() => {
    console.log('Current watchCategory:', watchCategory)
    console.log('Current watchSubCategory:', watchSubCategory)
    console.log('Current watchSubSubCategory:', watchSubSubCategory)
  }, [watchCategory, watchSubCategory, watchSubSubCategory])

  // Initial setup effect
  useEffect(() => {
    if (categories.length > 0 && watchCategory) {
      const selectedCategory = categories.find((cat) => cat._id === watchCategory?._id)
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories || [])
      }
    }
  }, [categories, watchCategory])

  useEffect(() => {
    if (subCategories.length > 0 && watchSubCategory) {
      const selectedSubCategory = subCategories.find(
        (subCat) => subCat.category === watchSubCategory?.name
      )
      if (selectedSubCategory) {
        setSubSubCategories(selectedSubCategory.subSubCategory || [])
      }
    }
  }, [subCategories, watchSubCategory])

  return (
    <Card className="w-full max-w-2xl border-none mx-auto shadow-none">
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select 
                  value={field.value?._id || ''}
                  onValueChange={(value) => {
                    const selectedCategory = categories.find((cat) => cat._id === value)
                    if (selectedCategory) {
                      field.onChange({
                        _id: selectedCategory._id,
                        name: selectedCategory.category,
                        slug: selectedCategory.slug
                      })
                    }
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue>
                      {watchCategory?.name || "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.category}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub_category">Sub Category</Label>
            <Controller
              name="sub_category"
              control={control}
              render={({ field }) => (
                <Select 
                  value={field.value?.slug || ''}
                  onValueChange={(value) => {
                    const selectedSubCategory = subCategories.find((subCat) => subCat.slug === value)
                    if (selectedSubCategory) {
                      field.onChange({
                        name: selectedSubCategory.category,
                        slug: selectedSubCategory.slug,
                        details: selectedSubCategory.details
                      })
                    }
                  }}
                  disabled={!watchCategory}
                >
                  <SelectTrigger id="sub_category">
                    <SelectValue>
                      {watchSubCategory?.name || "Select Sub Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCat) => (
                      <SelectItem key={subCat._id} value={subCat.slug}>
                        {subCat.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subsub_category_id">Sub Sub Category</Label>
            <Controller
              name="subsub_category_id"
              control={control}
              render={({ field }) => (
                <Select 
                  value={field.value?.slug || ''}
                  onValueChange={(value) => {
                    const selectedSubSubCategory = subSubCategories.find(
                      (subSubCat) => subSubCat.slug === value
                    )
                    if (selectedSubSubCategory) {
                      field.onChange({
                        name: selectedSubSubCategory.category,
                        slug: selectedSubSubCategory.slug
                      })
                    }
                  }}
                  disabled={!watchSubCategory}
                >
                  <SelectTrigger id="subsub_category_id">
                    <SelectValue>
                      {watchSubSubCategory?.name || "Select Sub Sub Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subSubCategories.map((subSubCat) => (
                      <SelectItem key={subSubCat._id} value={subSubCat.slug}>
                        {subSubCat.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assay">Assay</Label>
            <Controller
              name="assay"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="assay"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter Assay value"
                    {...field}
                  />
                  {/* <span className="flex items-center">%</span> */}
                </div>
              )}
            />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}

CategorySelectionForm.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired
}

export default CategorySelectionForm