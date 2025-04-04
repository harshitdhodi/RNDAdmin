import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-md aspect-[4/3] w-full sm:w-auto">
    <div className="w-full h-44 bg-gray-300"></div>
    <div className="p-3 bg-gray-400 mt-2 h-6 w-3/4 rounded"></div>
  </div>
);

// Capitalize utility
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export default function CategoryCards() {
  const { data: categories, isLoading } = useGetAllChemicalCategoriesQuery();
  const [visibleCategories, setVisibleCategories] = useState([]);

  // Optimize initial render by limiting visible cards
  useEffect(() => {
    if (categories) {
      // First show only the first 4 (or visible ones) for faster initial render
      setVisibleCategories(categories.slice(0, 4));
      
      // Then show all after a slight delay (improves perceived performance)
      const timer = setTimeout(() => {
        setVisibleCategories(categories);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [categories]);

  // Server-side or static site generation would be better for preloading
  // This is a client-side fallback approach
  const preconnectImageServer = () => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = '/api/logo';
    document.head.appendChild(link);
  };

  useEffect(() => {
    preconnectImageServer();
  }, []);

  return (
    <div className="w-full mt-7 flex flex-col justify-center items-center overflow-x-auto pb-6">
      <div className="grid gap-6 lg:max-w-[75rem] h-auto w-full px-4 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
        {isLoading
          ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          : visibleCategories?.map((category, index) => (
              <Link
                key={category._id}
                to={`/${category.slug}`}
                className="group relative aspect-[3/3] overflow-hidden w-full sm:w-auto"
              >
                <img
                  src={`/api/logo/download/${category.photo}`}
                  alt={category.name || "Download"}
                  className="object-fill sm:object-cover w-full h-full transition-transform group-hover:scale-105"
                  width={300}
                  height={300}
                  // First 2 images get highest priority
                  fetchPriority={index < 2 ? "high" : "auto"}
                  // First 4 images get eager loading
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  title={category.alt}
                  onLoad={(e) => {
                    // Mark this image as contentful
                    if (index < 2) {
                      e.currentTarget.setAttribute('fetchpriority', 'high');
                      e.currentTarget.setAttribute('importance', 'high');
                    }
                  }}
                />
                <div className="absolute bg-blue-900/10 inset-0"></div>
                <div className="absolute bg-blue-900 bottom-0 left-0 right-0 p-3 flex items-center justify-between text-white">
                  <h3 className="font-semibold text-sm">{capitalizeWords(category.name)}</h3>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))
        }
      </div>
    </div>
  );
}