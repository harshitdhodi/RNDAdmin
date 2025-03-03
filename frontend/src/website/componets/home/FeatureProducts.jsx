import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import cphi from "../../../assets/CPHI.png";
import pc from "../../../assets/pc.jpg";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllCataloguesQuery } from "@/slice/catalogue/catalogueslice";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const { data: catalogues, isLoading: isCataloguesLoading } = useGetAllCataloguesQuery();
  console.log(catalogues);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/chemical/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.map(chemical => ({
          title: chemical.name || chemical.category,
          image: chemical.images && chemical.images.length > 0 
            ? `/api/image/download/${chemical.images[0].url}`
            : '',
          slug: chemical.slug || chemical.name?.toLowerCase().replace(/\s+/g, '-') || chemical.category?.toLowerCase().replace(/\s+/g, '-'),
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events/getEvent');
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data[0]); // Assuming the API returns an array of events
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
    fetchEvent();
  }, []);

  if (isLoading || isCataloguesLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <div className="w-full flex justify-center px-4 md:px-6 lg:px-8">
      <div className="max-w-[75rem] w-full lg:px-5 py-8">
        <div className="flex flex-col lg:flex-row justify-center">
          {/* Featured Products Section */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center sm:justify-start">
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={`/${product.slug}`}
                  className="overflow-hidden w-full lg:w-[250px] lg:h-[220px] md:w-full md:h-auto border hover:shadow-lg transition-shadow"
                >
                  <div className="h-full flex flex-col items-center justify-between">
                    <div className="relative w-full h-[50%] flex items-center justify-center">
                      <img
                        alt={product.title}
                        className="object-contain mt-16 w-full h-full"
                        src={product.image}
                        title={product.title}
                        style={{ zIndex: 1 }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/default/image.jpg'; }} // Fallback image
                      />
                    </div>
                    <div className="bg-[#3B5998] w-full p-2 text-center" style={{ zIndex: 2, position: 'relative' }}>
                      <h3 className="text-white font-medium text-sm">
                        {product.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="w-full lg:w-[30%] md:w-[100%] flex flex-col md:flex-row lg:flex-col justify-center items-center">
            {/* Forthcoming Events */}
            <div className="py-4 pl-4">
              <h2 className="text-lg font-bold mb-4">Forthcoming Events</h2>
              {event && (
                <Card className="space-y-4 border p-4">
                  <div className="border-x border-t p-4">
                    <div dangerouslySetInnerHTML={{ __html: event.events }} />
                  </div>
                </Card>
              )}
            </div>

            {/* Product Catalogue */}
            <div className="w-full pl-4 md:mt-8">
              <div className="border-x border rounded-lg p-4">
                <div className="space-y-4">
                  {catalogues && catalogues.map((catalogue, index) => (
                    <div key={index}>
                      <h3 className="text-2xl font-bold mb-4">{catalogue.title}</h3>
                      <img
                        src={`/api/image/view/${catalogue.image}`}
                        alt={catalogue.title}
                        style={{ width: '100px' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/path/to/default/image.jpg'; }} // Fallback image
                      />
                      <Button className="w-[75%] bg-orange-500 hover:bg-orange-600" onClick={() => window.open(`/api/image/pdf/view/${catalogue.catalogue}`, '_blank')}>
                        DOWNLOAD BROCHURE
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}