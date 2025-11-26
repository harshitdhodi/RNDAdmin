import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create the API slice
export const chemicalCategoryApi = createApi({
  reducerPath: 'chemicalCategoryApi', // Unique key for the slice
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/chemicalCategory', // Base URL for all requests
  }),
  endpoints: (builder) => ({
    // Fetch all categories
    getAllChemicalCategories: builder.query({
      query: () => 'getAll',
    }),

      // Fetch subcategories by slug
    getSpecificSubcategoryBySlug: builder.query({
        query: (slug) => `getSpecificSubcategoryBySlug?slug=${slug}`, // Dynamically inject the slug
    }),

   // Fetch categories by slug
   getSpecificCategoryBySlug: builder.query({
    query: (slug) => `getSpecificCategory?slug=${slug}`, // Dynamically inject the slug
}),

    // Fetch specific category
    getSpecificCategory: builder.query({
      query: () => 'getSpecificCategory',
    }),

    // Fetch specific subcategory
    getSpecificSubcategory: builder.query({
      query: () => 'getSpecificSubcategory',
    }),

    // Fetch specific sub-subcategory
    getSpecificSubSubcategory: builder.query({
      query: () => 'getSpecificSubSubcategory',
    }),

    // Update category
    updateCategory: builder.mutation({
      query: (formData) => ({
        url: 'updateCategory',
        method: 'PUT',
        body: formData,
      }),
    }),

    // Update subcategory
    updateSubCategory: builder.mutation({
      query: (formData) => ({
        url: 'updateSubCategory',
        method: 'PUT',
        body: formData,
      }),
    }),

    // Update sub-subcategory
    updateSubSubCategory: builder.mutation({
      query: (formData) => ({
        url: 'updatesubsubcategory',
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useGetAllChemicalCategoriesQuery,
  useGetSpecificCategoryQuery,
  useGetSpecificSubcategoryQuery,
  useGetSpecificSubSubcategoryQuery,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
  useUpdateSubSubCategoryMutation,
  useGetSpecificSubcategoryBySlugQuery,
  useGetSpecificCategoryBySlugQuery
} = chemicalCategoryApi;
