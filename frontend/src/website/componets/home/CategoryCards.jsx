import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-md aspect-[4/3] w-full sm:w-auto">
    <div className="w-full h-44 bg-gray-300"></div>
    <div className="p-3 bg-gray-400 mt-2 h-6 w-3/4 rounded"></div>
  </div>
);

// Capitalize utility
function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export default function CategoryCards() {
  const { data: categories, isLoading } = useGetAllChemicalCategoriesQuery();
  
  return (
    <div className="w-full mt-7 flex flex-col justify-center items-center overflow-x-auto pb-6">
      <div className="grid gap-6 lg:max-w-[75rem] h-auto w-full px-4 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
        {isLoading
          ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />) // Show 8 skeleton cards while loading
          : categories?.map((category) => (
              <Link
                key={category._id}
                to={`/${category.slug}`}
                className="group relative aspect-[4/3] overflow-hidden w-full sm:w-auto"
              >
                <img
                  src={`/api/logo/download/${category.photo}`}
                  alt={category.name || "Download"}
                  className="object-cover  transition-transform group-hover:scale-105"
                  width={400}
                  height={300}
                  loading="lazy" // Lazy loading for performance
                  title={category.alt}
                />
                <div className="absolute bg-yellow-900/10 inset-0"></div>
                <div className="absolute bg-yellow-900 bottom-0 left-0 right-0 p-3 flex items-center justify-between text-white">
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
