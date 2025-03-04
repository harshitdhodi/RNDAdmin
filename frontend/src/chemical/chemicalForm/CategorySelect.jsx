import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const CategorySelectionForm = ({ control, watch, setValue }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllChemicalCategoriesQuery();

  const watchCategory = watch('category');
  const watchSubCategory = watch('sub_category');
  const watchSubSubCategory = watch('subsub_category_id');
  const watchCategorySlug = watch('categorySlug');
  const watchSubCategorySlug = watch('subCategorySlug');
  const watchSubSubCategorySlug = watch('subSubCategorySlug');

  const categories = categoriesData || [];

  // Update sub-categories and slug when category changes
  useEffect(() => {
    if (categories.length > 0 && watchCategory) {
      const selectedCategory = categories.find((cat) => cat._id === watchCategory);
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories || []);
        setValue('categorySlug', selectedCategory.slug); // Sync slug
        // Reset dependent fields
        setValue('sub_category', '');
        setValue('subCategorySlug', '');
        setValue('subsub_category_id', '');
        setValue('subSubCategorySlug', '');
        setSubSubCategories([]);
      }
    }
  }, [categories, watchCategory, setValue]);

  // Update sub-sub-categories and slug when sub-category changes
  useEffect(() => {
    if (subCategories.length > 0 && watchSubCategory) {
      const selectedSubCategory = subCategories.find((subCat) => subCat._id === watchSubCategory);
      if (selectedSubCategory) {
        setSubSubCategories(selectedSubCategory.subSubCategory || []);
        setValue('subCategorySlug', selectedSubCategory.slug); // Sync slug
        // Reset dependent field
        setValue('subsub_category_id', '');
        setValue('subSubCategorySlug', '');
      }
    }
  }, [subCategories, watchSubCategory, setValue]);

  // Update sub-sub-category slug when it changes
  useEffect(() => {
    if (subSubCategories.length > 0 && watchSubSubCategory) {
      const selectedSubSubCategory = subSubCategories.find(
        (subSubCat) => subSubCat._id === watchSubSubCategory
      );
      if (selectedSubSubCategory) {
        setValue('subSubCategorySlug', selectedSubSubCategory.slug); // Sync slug
      }
    }
  }, [subSubCategories, watchSubSubCategory, setValue]);

  return (
    <Card className="w-full max-w-2xl border-none mx-auto shadow-none">
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    const selectedCategory = categories.find((cat) => cat._id === value);
                    if (selectedCategory) {
                      field.onChange(selectedCategory._id);
                      setValue('categorySlug', selectedCategory.slug);
                    }
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue>
                      {watchCategory
                        ? categories.find((cat) => cat._id === watchCategory)?.category
                        : "Select Category"}
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

          {/* Sub Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="sub_category">Sub Category</Label>
            <Controller
              name="sub_category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    const selectedSubCategory = subCategories.find((subCat) => subCat._id === value);
                    if (selectedSubCategory) {
                      field.onChange(selectedSubCategory._id);
                      setValue('subCategorySlug', selectedSubCategory.slug);
                    }
                  }}
                  disabled={!watchCategory}
                >
                  <SelectTrigger id="sub_category">
                    <SelectValue>
                      {watchSubCategory
                        ? subCategories.find((subCat) => subCat._id === watchSubCategory)?.category
                        : "Select Sub Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.length > 0 ? (
                      subCategories.map((subCat) => (
                        <SelectItem key={subCat._id} value={subCat._id}>
                          {subCat.category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No sub-categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Sub Sub Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="subsub_category_id">Sub Sub Category</Label>
            <Controller
              name="subsub_category_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => {
                    const selectedSubSubCategory = subSubCategories.find(
                      (subSubCat) => subSubCat._id === value
                    );
                    if (selectedSubSubCategory) {
                      field.onChange(selectedSubSubCategory._id);
                      setValue('subSubCategorySlug', selectedSubSubCategory.slug);
                    }
                  }}
                  disabled={!watchSubCategory}
                >
                  <SelectTrigger id="subsub_category_id">
                    <SelectValue>
                      {watchSubSubCategory
                        ? subSubCategories.find((subSubCat) => subSubCat._id === watchSubSubCategory)?.category
                        : "Select Sub Sub Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subSubCategories.length > 0 ? (
                      subSubCategories.map((subSubCat) => (
                        <SelectItem key={subSubCat._id} value={subSubCat._id}>
                          {subSubCat.category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No sub-sub-categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

         
        </div>
      </CardContent>
    </Card>
  );
};

CategorySelectionForm.propTypes = {
  control: PropTypes.object.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default CategorySelectionForm;