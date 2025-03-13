import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Footer from "../home/Footer";

export default function ProductSearchBar() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("tab"); // Get the 'tab' query parameter for slug
  const [chemical, setChemical] = useState(null); // State to hold the fetched chemical data
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [isError, setIsError] = useState(false); // State for error status

  useEffect(() => {
    if (!slug) return; // Skip fetching if no slug is provided

    const fetchChemicalData = async () => {
      try {
        const response = await fetch(`/api/chemical/getBySlug?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setChemical(data); // Set the fetched chemical data
        } else {
          setIsError(true); // Set error state if the request failed
        }
      } catch (error) {
        console.error("Error fetching chemical data:", error);
        setIsError(true); // Set error state on failure
      } finally {
        setIsLoading(false); // Set loading state to false after the request completes
      }
    };

    fetchChemicalData();
  }, [slug]); // Fetch data when the slug changes

  if (isLoading) {
    return (
      <div className="flex justify-center w-full min-h-[200px] items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !chemical) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl p-6">
          <h1 className="text-2xl font-semibold mb-4">No results found</h1>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Search Results for "{chemical.name || 'Unknown'}"
        </h1>
        
        <div className="text-sm text-gray-600 mb-4">
          Showing details for {chemical.name}
        </div>

        <Table>
          <TableHeader className="bg-blue-700">
            <TableRow>
              <TableHead className="text-white">Product Code</TableHead>
              <TableHead className="text-white">Product Name</TableHead>
              <TableHead className="text-white">Grades</TableHead>
              <TableHead className="text-white">CAS</TableHead>
              <TableHead className="text-white">TDS</TableHead>
              <TableHead className="text-white">MSDS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-blue-50">
              <TableCell>{chemical.product_code || chemical.auto_p_code || 'N/A'}</TableCell>
              <TableCell>
                <Link 
                  to={`/${chemical.slug}`} 
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {chemical.name}
                </Link>
              </TableCell>
              <TableCell>{chemical.grade || 'N/A'}</TableCell>
              <TableCell>{chemical.cas_number || 'N/A'}</TableCell>
              <TableCell>
                {chemical.tds_url ? (
                  <Link to={chemical.tds_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Specs
                  </Link>
                ) : (
                  "Specs"
                )}
              </TableCell>
              <TableCell>
                {chemical.msds_url ? (
                  <Link to={chemical.msds_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    MSDS
                  </Link>
                ) : (
                  "MSDS"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

      
      </div>
    </div>
    <Footer/>
    </>
  );
}
