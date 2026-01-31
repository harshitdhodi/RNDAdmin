import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { CategorySelectionForm } from "./CategorySelect";
import { ChemicalInfoForm } from "./ChemicalInfo";
import { ChemicalPropertiesForm } from "./ChemicalProperties";
import { MetaInformationForm } from "./MetaInfo";
import { Button } from "@/components/ui/button";
import ImageUploadForm from './ImageUpload';

export const ChemicalFormPage = () => {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      category: "",
      sub_category: "",
      subsub_category_id: "",
      categorySlug: "",
      subCategorySlug: "",
      subSubCategorySlug: "",
      name: "",
      slug: "",
      images: [],
      catalog: "",
      msds: "",
      specs: "",
      unit: "",
      chemical_type: "",
      cas_number: "",
      packings: [],
      grade: "",
      iupac: "",
      h_s_code: "",
      molecular_weight: "",
      molecular_formula: "",
      synonyms: [],
      application: [],
      chemical_industries: [],
      product_code: "",
      auto_p_code: "",
      packing: "",
      hs_code: "",
      assay: "",
      form: "",
      meltingPoint: "",
      boilingPoint: "",
      solubility: "",
      flashPoint: "",
      class: "",
      olfactory: "",
      metatitle: "",
      metadescription: "",
      metakeywords: "",
      metacanonical: "",
      metalanguage: "",
      metaschema: "",
      otherMeta: "",
      imagesToDelete: {}
    }
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [chemicalData, setChemicalData] = useState(null);

  // Debug: Log when component mounts and id changes
  useEffect(() => {
    console.log("🔵 ChemicalFormPage mounted. ID:", id);
    console.log("🔵 Mode:", id ? "EDIT MODE" : "CREATE MODE");
  }, [id]);

  useEffect(() => {
    const fetchChemicalData = async () => {
      if (id) {
        console.log("📥 Fetching chemical data for ID:", id);
        setIsLoading(true);
        try {
          const response = await axios.get(`/api/chemical/getChemicalById?id=${id}`);
          const data = response.data;
          console.log("✅ Chemical data fetched successfully:", data);
          setChemicalData(data);

          // Set category-related fields
          if (data.category) {
            console.log("📁 Setting category:", data.category);
            setValue("category", data.category._id);
            setValue("categorySlug", data.category.slug);
          }
          if (data.sub_category) {
            console.log("📁 Setting sub_category:", data.sub_category);
            setValue("sub_category", data.sub_category._id);
            setValue("subCategorySlug", data.sub_category.slug);
          }
          if (data.subsub_category_id) {
            console.log("📁 Setting subsub_category_id:", data.subsub_category_id);
            setValue(
              "subsub_category_id",
              typeof data.subsub_category_id === "object" ? data.subsub_category_id._id : data.subsub_category_id
            );
            setValue("subSubCategorySlug", data.subsub_category_id.slug || "");
          }

          // Set other fields
          Object.entries(data).forEach(([key, value]) => {
            if (
              key !== "category" &&
              key !== "sub_category" &&
              key !== "subsub_category_id" &&
              key !== "images"
            ) {
              setValue(key, value);
            }
          });

          if (data.images && data.images.length > 0) {
            console.log("🖼️ Setting images:", data.images);
            setValue("images", data.images);
          }
        } catch (error) {
          console.error("❌ Error fetching chemical data:", error);
          console.error("❌ Error details:", error.response?.data);
          setSubmitError(`Failed to fetch chemical data: ${error.response?.data?.message || error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchChemicalData();
  }, [id, setValue]);

  const onSubmitForm = async (data) => {
    console.log("🚀 Form submission started");
    console.log("📋 Form data received:", data);
    console.log("🔧 Form errors:", errors);
    
    if (isSubmitting) {
      console.log("⚠️ Already submitting, ignoring duplicate submission");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      console.log("📦 Creating FormData object");

      // Handle images
      console.log("🖼️ Processing images. Total count:", data.images?.length || 0);
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          console.log(`🖼️ Processing image ${index}:`, image);
          
          if (image.file instanceof File) {
            console.log(`  ✅ New image file detected: ${image.file.name}`);
            formData.append("images", image.file);
            formData.append(`altText-${index}`, image.altText || "");
            formData.append(`title-${index}`, image.title || "");
          } else if (image._id) {
            console.log(`  ✅ Existing image detected: ${image._id}`);
            formData.append(`existingImages[${index}][_id]`, image._id);
            formData.append(`existingImages[${index}][altText]`, image.altText || "");
            formData.append(`existingImages[${index}][title]`, image.title || "");
          } else {
            console.log(`  ⚠️ Image ${index} has no file or _id:`, image);
          }
        });
      }

      // Append images to delete
      if (data.imagesToDelete && Object.keys(data.imagesToDelete).length > 0) {
        console.log("🗑️ Images to delete:", data.imagesToDelete);
        Object.keys(data.imagesToDelete).forEach((imageId) => {
          formData.append("imagesToDelete[]", imageId);
        });
      }

      // Append other form data
      console.log("📝 Appending other form data");
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "images" &&
          key !== "imagesToDelete" &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          if (Array.isArray(value)) {
            console.log(`  📊 Array field '${key}':`, value);
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (key === "molecular_weight" && value) {
            console.log(`  🔢 Number field '${key}':`, value);
            formData.append(key, Number(value));
          } else {
            console.log(`  📝 Field '${key}':`, value);
            formData.append(key, value);
          }
        }
      });

      // Log FormData contents
      console.log("📦 FormData contents:");
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1]);
      }

      let response;
      if (id) {
        console.log(`🔄 Updating chemical with ID: ${id}`);
        console.log(`🌐 PUT request to: /api/chemical/updateChemicalById?id=${id}`);
        response = await axios.put(`/api/chemical/updateChemicalById?id=${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        console.log("➕ Creating new chemical");
        console.log("🌐 POST request to: /api/chemical/add");
        response = await axios.post("/api/chemical/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("✅ Form submitted successfully");
      console.log("📥 Response:", response.data);
      
      alert(`Chemical ${id ? 'updated' : 'created'} successfully!`);
      navigate("/chemical-table");
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error stack:", err.stack);
      
      const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
      setSubmitError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Form submission completed");
    }
  };

  // Debug: Watch form values
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("📝 Form value changed:", { name, type, value: value[name] });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  if (isLoading) {
    console.log("⏳ Loading chemical data...");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading existing chemical data...</div>
          <div className="text-sm text-gray-500 mt-2">Chemical ID: {id}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-purple-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/chemical-table" className="hover:text-purple-600">Chemicals</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{id ? "Edit Chemical" : "New Chemical"}</span>
      </div>

      {/* Debug Info Banner */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="font-semibold text-yellow-900">Debug Information:</div>
        <div className="text-sm text-yellow-800 mt-2">
          <div>Mode: <strong>{id ? `EDIT (ID: ${id})` : "CREATE"}</strong></div>
          <div>Submitting: <strong>{isSubmitting ? "Yes" : "No"}</strong></div>
          <div>Has Errors: <strong>{Object.keys(errors).length > 0 ? "Yes" : "No"}</strong></div>
          {Object.keys(errors).length > 0 && (
            <div className="mt-2">
              <div className="font-semibold">Form Errors:</div>
              <pre className="text-xs bg-white p-2 rounded mt-1">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold text-red-900">Submission Error:</div>
          <div className="text-sm text-red-800 mt-1">{submitError}</div>
        </div>
      )}

      <form 
        onSubmit={(e) => {
          console.log("🎯 Form submit event triggered");
          e.preventDefault();
          console.log("🎯 Calling handleSubmit");
          handleSubmit(onSubmitForm)(e);
        }} 
        className="space-y-6 bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Category Information</h2>
            <CategorySelectionForm control={control} watch={watch} setValue={setValue} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chemical Details</h2>
            <ChemicalInfoForm control={control} setValue={setValue} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chemical Properties</h2>
            <ChemicalPropertiesForm control={control} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            <ImageUploadForm control={control} setValue={setValue} chemicalData={chemicalData} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Meta Information</h2>
            <MetaInformationForm control={control} chemicalData={chemicalData} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 w-1/4 text-white rounded-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => console.log("🖱️ Button clicked")}
          >
            {isSubmitting 
              ? "Processing..." 
              : id 
                ? "Update Chemical" 
                : "Submit Chemical"}
          </Button>
        </div>

        {/* Alternative native button for testing */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            onClick={() => console.log("🖱️ Native button clicked")}
          >
            {isSubmitting 
              ? "Processing..." 
              : `[TEST] ${id ? "Update" : "Submit"} Chemical`}
          </button>
        </div>
      </form>
    </>
  );
};

export default ChemicalFormPage;