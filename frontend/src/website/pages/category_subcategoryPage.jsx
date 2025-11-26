import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from '../componets/category_subcategory/BreadCrumb';
import { Sidebar } from '../componets/category_subcategory/Sidebar';
import ProductTable from '../componets/category_subcategory/ProductTable';
import { Pagination } from '../componets/category_subcategory/Pegination';
import SubCategoryInfo from '../componets/category_subcategory/SubcategoryInfo';
import axios from 'axios';
import Footer from '../componets/home/Footer';

export default function ChemicalSubcategoryPage() {
  const { chemicals, slug, subsubCategorySlug } = useParams();
  console.log({chemicals,slug,subsubCategorySlug})
  const [chemicalData, setChemicalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Check if the URL path starts with specific keywords for different categories
  const isProductsPath =
    location.pathname.startsWith('/chemicals') ||
    location.pathname.startsWith('/microbiology') ||
    location.pathname.startsWith('/plant-culture-tested-chemical') ||
    location.pathname.startsWith('/cell-culture-tested-chemical');
  
  // Initialize the categoryName based on the URL path
  let categoryName = '';
  if (isProductsPath) {
    if (location.pathname.startsWith('/chemicals')) {
      categoryName = 'Fine Chemicals';
    } else if (location.pathname.startsWith('/microbiology')) {
      categoryName = 'MicroBiology Products';
    } else if (location.pathname.startsWith('/plant-culture-tested-chemical')) {
      categoryName = 'Plant Culture Tested Chemical';
    } else if (location.pathname.startsWith('/cell-culture-tested-chemical')) {
      categoryName = 'Cell Culture Tested Chemical';
    }
  }

  const { chemicalName, subCategoryName } = location.state || {};

  // Fetch chemicals by subsubCategorySlug or categoryslug and subcategoryslug
  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;

        // Check if subsubCategorySlug is available
        if (subsubCategorySlug) {
          // Fetch chemicals by subsubCategorySlug
          response = await axios.get(`/api/chemical/getChemicalBysubsubCategorySlug`, {
            params: {
              slug: subsubCategorySlug,
            },
          });
        } else {
          // Fetch chemicals by categoryslug and subcategoryslug
          response = await axios.get(`/api/chemical/getChemical`, {
            params: {
              categoryslug: chemicals,
              subcategoryslug: slug,
            },
          });
        }

        const data = response.data;
        setChemicalData(Array.isArray(data) ? data : []);
        setFilteredData(Array.isArray(data) ? data : []); // Initialize filtered data with all data
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching chemicals');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if chemicals and slug are available
    if ((chemicals && slug) || subsubCategorySlug) {
      fetchChemicals();
    }
  }, [chemicals, slug, subsubCategorySlug]);

  // Filter data whenever selections change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...chemicalData];

      // Apply subcategory filter
      if (selectedSubCategories.length > 0) {
        result = result.filter((item) =>
          selectedSubCategories.includes(item.subSubCategorySlug)
        );
      }

      // Apply grade filter
      if (selectedGrades.length > 0) {
        result = result.filter((item) => selectedGrades.includes(item.grade));
      }

      setFilteredData(result);
    };

    applyFilters();
  }, [chemicalData, selectedSubCategories, selectedGrades]);

// Map necessary data for rendering in the table
const processedData = filteredData.map(item => ({
  id: item._id,
  name: item.name,
  slug: item.slug,
  auto_p_code: item.auto_p_code,
  molecularFormula: item.molecular_formula,
  molecularWeight: item.molecular_weight,
  category: item.categorySlug,
  subCategory: item.subCategorySlug,
  subSubCategory: item.subSubCategorySlug,
  unit: item.unit,
  cas: item.cas_number,
  msds: item.msds,
  specs: item.specs,
  image: item.images?.length > 0 ? item.images[0] : null, // Safely access the first image
}));

  return (
    <>
    <div className="max-w-7xl mx-auto py-4 mb-10">
      <Breadcrumb 
        chemicalName={chemicalName} 
        slug2={slug} 
        categoryName={categoryName} 
        subCategoryName={subCategoryName} 
        subsubCategorySlug={subsubCategorySlug}
        categorySlug={chemicals}
        subCategorySlug={slug}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Sidebar
          chemicals={chemicalData}
          categorySlug={slug}
          selectedSubCategories={selectedSubCategories}
          selectedGrades={selectedGrades}
          setSelectedSubCategories={setSelectedSubCategories}
          setSelectedGrades={setSelectedGrades}
          subsubCategorySlug={subsubCategorySlug}
          categoryName={chemicals}
        />
        <div className="md:col-span-2">
          <SubCategoryInfo categorySlug={slug} subsubCategorySlug={subsubCategorySlug} />
          <ProductTable
            chemicals={processedData}
            isLoading={isLoading}
            error={error}
            subsubCategorySlug={subsubCategorySlug}
          />
          {/* <Pagination /> */}
        </div>
      </div>
    </div>
    {/* <Footer/> */}
    </>
  );
}
