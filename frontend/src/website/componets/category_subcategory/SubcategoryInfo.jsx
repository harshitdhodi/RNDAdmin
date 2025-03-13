import React from 'react';
import PropTypes from 'prop-types';
import { useGetSpecificSubcategoryBySlugQuery } from '@/slice/chemicalSlice/chemicalCategory';

const SubCategoryInfo = ({ categorySlug, subsubCategorySlug }) => {
  const { data, error, isLoading } = useGetSpecificSubcategoryBySlugQuery(categorySlug);
  console.log(data);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading category data.</p>;
  if (!data) return <p>Category Not Found</p>;

  const { category, details, photo } = data;

  // Check if subsubCategorySlug is provided
  const displaySubCategory = subsubCategorySlug
    ? subsubCategorySlug.charAt(0).toUpperCase() + subsubCategorySlug.slice(1) // Capitalize the first letter
    : category; // If no subsubCategorySlug, display the entire category name

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-6">{displaySubCategory}</h1>

      {/* If subsubCategorySlug is not provided, show the details and image */}
      {!subsubCategorySlug && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/4">
            <img src={`/api/logo/download/${photo}`} alt={category || "hey"} className="w-full object-contain" />
          </div>
          <div className="w-full md:w-3/4">
            <p className="text-gray-700 text-justify">{details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

SubCategoryInfo.propTypes = {
  categorySlug: PropTypes.string.isRequired,
  subsubCategorySlug: PropTypes.string, // Make subsubCategorySlug optional
};

export default SubCategoryInfo;
