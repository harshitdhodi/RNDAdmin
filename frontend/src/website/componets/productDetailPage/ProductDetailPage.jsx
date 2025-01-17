import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "../SubCategoryPage/BreadCrumb";
import ImageSection from "./ProductImageSec";
import ProductInfo from "./ProductInfo";
import MSDSSection from "./MSDSSection";
import MadeInIndia from "./MadeInIndia";
import { useParams } from "react-router-dom";
import InquiryForm from "./InquiryForm";
import Footer from "../home/Footer";
import RecentProduct from "./RecentProduct";
import { Helmet } from "react-helmet";

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [batchNumber, setBatchNumber] = useState("");
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const { chemicals } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/chemical/getBySlug?slug=${chemicals}`);
        if (!response.ok) throw new Error("Failed to fetch product data");
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (chemicals) {
      fetchProductData();
    }
  }, [chemicals]);

  useEffect(() => {
    if (showInquiryForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showInquiryForm]);

  useEffect(() => {
    if (productData) {
      document.title = `${productData.metatitle} - Product Details`;
    } else {
      document.title = "Loading...";
    }
  }, [productData]);

  const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image+Available";

  const images = productData?.images?.length > 0
    ? productData.images.map(img => ({
        url: img.url ? `/${img.url.replace(/\\/g, '/')}` : fallbackImage,
        alt: img.altText || "Product Image",
        title: img.title || "Product Image",
      }))
    : [{ url: fallbackImage, alt: "No Image Available", title: "No Image" }];

  const fallbackDetails = [
    { label: "Product Code", value: "N/A" },
    { label: "Assay", value: "N/A" },
    { label: "Molecular Formula", value: "N/A" },
    { label: "Packings", value: "N/A" },
    { label: "Grade", value: "N/A" },
    { label: "CAS", value: "N/A" },
    { label: "Molecular Weight", value: "N/A" },
    { label: "HS CODE", value: "N/A" },
    { label: "MSDS", value: "N/A" },
    { label: "Specs", value: "N/A" },
  ];

  const productDetails = productData
    ? [
        { label: "Product Code", value: productData.product_code || "N/A" },
        { label: "Assay", value: productData.assay || "N/A" },
        { label: "Molecular Formula", value: productData.molecular_formula || "N/A" },
        { label: "Packings", value: productData.packings || "N/A" },
        { label: "Grade", value: productData.grade || "N/A" },
        { label: "CAS", value: productData.cas_number || "N/A" },
        { label: "Molecular Weight", value: productData.molecular_weight || "N/A" },
        { label: "HS CODE", value: productData.h_s_code || "N/A" },
        { label: "MSDS", value: productData.msds || "N/A" },
        { label: "Specs", value: productData.specs || "N/A" },
      ]
    : fallbackDetails;

  return (
    <>
      <Helmet>
        <title>{productData ? `${productData.metatitle} - Product Details` : "Loading..."}</title>
      </Helmet>
      <div className="max-w-6xl mx-auto mb-10 px-4 py-2 relative">
        {showInquiryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <InquiryForm
              productName={productData?.name}
              onClose={() => setShowInquiryForm(false)}
            />
          </div>
        )}
        <Breadcrumb chemicals={productData?.category.name} slug={productData?.category.slug} categorySlug={productData?.name} />
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error fetching product data</div>
        ) : (
          <>
            <div className="md:flex gap-12">
              <ImageSection
                images={images}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
              <div className="w-[100%]">
                <ProductInfo
                  productDetails={productDetails}
                  name={productData?.name}
                  cas={productData?.cas_number}
                />
                <MSDSSection
                  batchNumber={batchNumber}
                  setBatchNumber={setBatchNumber}
                  msds={productData?.msds}
                  specs={productData?.specs}
                  name={productData?.name}
                  onInquiry={() => setShowInquiryForm(true)}
                />
              </div>
             
            </div>
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg shadow-md border border-blue-200">
              <h2 className="text-2xl font-semibold mb-6 text-blue-900 border-b border-blue-200 pb-3">
                Product Description
              </h2>
              <div 
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none
                  prose-headings:text-blue-900 
                  prose-p:text-gray-600 
                  prose-strong:text-blue-800
                  prose-ul:list-disc 
                  prose-ul:pl-5
                  prose-li:my-1
                  prose-a:text-blue-600 
                  prose-a:hover:text-blue-800"
                dangerouslySetInnerHTML={{ 
                  __html: productData?.description || "No description available for this product." 
                }}
              />
            </div>
          </>
        )}
        <div>
          <RecentProduct/>
        </div>
        <MadeInIndia global_tagline={productData?.global_tagline} name={productData?.name} cas={productData?.cas_number} />
      </div>
      
    </>
  );
}

