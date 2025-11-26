import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const RecentProduct = () => {
  const [recentProducts, setRecentProducts] = useState(null);
  const { chemicals } = useParams();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get(`/api/chemical/getLatestChemicalsExcept?slug=${chemicals}`);
        setRecentProducts(response.data);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchRecentProducts();
  }, [chemicals]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-blue-900">Recent Products</h2>
        <div className="w-[10%] h-1 bg-blue-800"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recentProducts?.data?.map((product) => (
          <Link 
            to={`/${product.slug}`} 
            key={product._id}
            className="group bg-white  overflow-hidden shadow-md hover:shadow-2xl 
            transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex flex-col h-full">
              <div className="relative p-4 bg-gray-50">
                <div className="aspect-w-16 aspect-h-9 h-[40vh]">
                  <img
                    src={`/api/image/download/${product.images[0]?.url}`}
                    alt={product.images[0]?.altText || product.name}
                    className="w-full h-full object-contain  
                    group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <div className="p-5 space-y-3 flex-1 bg-gradient-to-b from-blue-50 to-blue-100">
                <h3 className="font-semibold text-xl text-gray-800 truncate 
                  group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <span className="font-medium">Category:</span> 
                  <span className="bg-blue-100 px-2 py-1 rounded-full">
                    {product.categorySlug}
                  </span>
                </p>
                {product.cas_number && (
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <span className="font-medium">CAS Number:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {product.cas_number}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentProduct;
