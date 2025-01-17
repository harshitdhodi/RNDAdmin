import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory';
import { ArrowRight } from 'lucide-react'
import { Link } from "react-router-dom"

// Utility function to capitalize the first letter of each word
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export default function CategoryCards() {
  const { data: categories, isLoading } = useGetAllChemicalCategoriesQuery();
console.log(categories)
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full  mt-7 justify-center items-center flex flex-col overflow-x-auto pb-6">
      <div className="grid gap-6 lg:max-w-[75rem] h-auto w-full px-4 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
        {categories?.map((category) => (
          <Link
            key={category._id}
            to={`/${category.slug}`}
            className="group relative aspect-[4/3] overflow-hidden w-full sm:w-auto"
          >
            <img
              src={`/api/logo/download/${category.photo}`}
              alt={category.name}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
              width={300}
              height={300}
              title={category.alt}
            />
            <div className="absolute bg-blue-900/80" />
            <div className="absolute bg-blue-900 bottom-0 left-0 right-0 p-3 flex items-center justify-between text-white">
              <h3 className="font-semibold text-sm">{capitalizeWords(category.name)}</h3>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>


    </div>
  )
}

