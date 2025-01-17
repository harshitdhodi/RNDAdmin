import { Plus, Minus } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useGetAllChemicalCategoriesQuery } from "@/slice/chemicalSlice/chemicalCategory";
import PromoSidebar from '../SubCategoryPage/PromoSidebar';

const ProductCategory = () => {
  const { data: categories, isLoading, isError } = useGetAllChemicalCategoriesQuery();

  const [openSubCategories, setOpenSubCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (categories) {
      const initialOpenState = {};
      categories.forEach(category => {
        category.subCategories.forEach(subCategory => {
          initialOpenState[subCategory.slug] = false;
        });
      });
      setOpenSubCategories(initialOpenState);
    }
  }, [categories]);

  const toggleSubCategory = (slug) => {
    setOpenSubCategories(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const handleSubCategoryClick = (categorySlug, subCategorySlug, chemicalName) => {
    // Find the category name from the categories array
    const category = categories?.find(cat => cat.slug === categorySlug);
    const categoryName = category?.name;
    const slug2 = category?.slug;
    console.log(slug2)
    // Navigate and pass data to the breadcrumb
    navigate(`/${categorySlug}/${subCategorySlug}`, { 
      state: { 
        chemicalName,
        categoryName,
        slug2 
      } 
    });
  };

 const handleSubSubCategoryClick = (parentSlug, subCategorySlug, subSubCategorySlug, categoryName) => {
  // Pass the necessary state along with the navigation
  navigate(`/${parentSlug}/${subCategorySlug}/${subSubCategorySlug}`, {
    state: {
      categoryName,  // The category name to be passed to the target page
      parentSlug,    // The parent category slug (optional, if you need it)
      subCategorySlug, // Subcategory slug
      subSubCategorySlug, // Sub-subcategory slug
    }
  });
};


  const renderSubSubCategories = (subSubCategories, parentSlug, subCategorySlug) => (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 ml-5">
      {subSubCategories.map((subSubCat) => (
        <li
          key={subSubCat.slug}
          className="flex items-center text-gray-600 cursor-pointer hover:text-blue-700"
          onClick={() => handleSubSubCategoryClick(parentSlug, subCategorySlug, subSubCat.slug)}
        >
          <span className="mr-2">›</span>
          {subSubCat.category}
        </li>
      ))}
    </ul>
  );

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (isError) return <div className="text-center py-4 text-red-500">Error loading categories</div>;

  return (
    <div className="w-full md:max-w-7xl mx-auto min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="pt-5 sm:text-xs md:text-sm lg:text-base text-[11px] border-b pb-3 w-[98%] ml-8 mb-5 py-2">
        <ul className="flex gap-2 flex-wrap">
          <li>
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
          </li>
          <li className="text-gray-400">&gt;</li>
          <li>
            <a href="/products" className="text-gray-600 hover:text-blue-600">
              Products
            </a>
          </li>
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="flex flex-col md:flex-row justify-center gap-10 p-6 w-full">
          {/* Left sidebar */}
          <div className="w-full border px-5 py-3 md:w-[75%]">
            <div className="space-y-8"> {/* Increased space between categories */}
              {categories?.map((category) => (
                <div key={category.slug} className="rounded-lg p-4 shadow-md"> {/* Added padding and shadow for spacing */}
                  <div className="flex items-center mb-6 gap-6">
                    {/* Dynamically rendering category image */}
                    <img
                      src={category.image || "https://img.freepik.com/free-vector/abstract-chemical-logo_23-2148610094.jpg?w=200"} // Fallback image
                      alt={category.name}
                      className="h-8 "
                    />
                    {/* Dynamically rendering category name */}
                    <h2 className="text-blue-800 font-bold text-lg">
                      {category.name}
                    </h2>
                  </div>
                  {/* Render subcategories if available */}
                  {category.subCategories?.map((subCategory) => (
                    <div key={subCategory.slug} className="rounded-none ">
                      <div
                        className="p-1 flex items-center justify-between cursor-pointer"
                        onClick={() => handleSubCategoryClick(category.slug, subCategory.slug, subCategory.category)}
                      >
                        <div className='flex p-1 px-4 justify-between items-center w-full bg-blue-100'>
                        <span className="text-blue-800  text-lg font-normal hover:text-blue-700 transition-colors">
                          {subCategory.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubCategory(subCategory.slug);
                          }}
                          className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          {openSubCategories[subCategory.slug] ? (
                            <Minus className="w-5 h-5 text-blue-900" />
                          ) : (
                            <Plus className="w-5 h-5 text-blue-900" />
                          )}
                        </button>
                        </div>
                      </div>
                      {openSubCategories[subCategory.slug] && subCategory.subSubCategory && (
                        <div className="px-6 py-4 bg-white rounded-b-lg">
                          {renderSubSubCategories(
                            subCategory.subSubCategory,
                            category.slug, // Parent category slug
                            subCategory.slug // Subcategory slug
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>


          {/* Right content */}
          <div className="relative h-[30vh] sm:h-[40vh] lg:h-[60vh] w-1/4">
            <PromoSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
