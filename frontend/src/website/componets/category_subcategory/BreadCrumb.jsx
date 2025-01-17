import React from 'react';
import { Link } from 'react-router-dom';
// Utility function to capitalize words and handle multi-space words
const formatText = (text) => {
  if (!text) return '';
  
  // Split by hyphens and spaces
  return text
    .split(/[-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
export function Breadcrumb({ chemicalName,categorySlug, categoryName, slug2, subsubCategorySlug }) {
  console.log(categoryName) 
  return (
    <nav className="text-sm mb-6 border-b-2 pb-3">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link to="/" className="text-[15px]">Home</Link>
          <span className="mx-2">››</span>
        </li>
        <li className="flex items-center">
          <Link to="/categories" className="text-[15px]">Products</Link>
          <span className="mx-2">››</span>
        </li>
        <li className="flex items-center">
          <span className="text-[15px]">
            <Link to={`/${categorySlug}`} className="text-black">
              {formatText(categoryName)}
            </Link>
          </span>
          <span className="mx-2">››</span>
        </li>
        <li className="flex items-center">
          <span className="text-[15px]">
            <Link to={`/chemicals/${slug2}`} className="text-black">
            {formatText(slug2)}
            </Link>
          </span>
        
        </li>
        {subsubCategorySlug && (
          <li className="flex items-center">
              <span className="mx-2">››</span>
            <span className="text-[15px] text-orange-600"> 
             {formatText(subsubCategorySlug)}

            </span>
        
          </li>
        )}
       
      </ol>
    </nav>
  );
}
