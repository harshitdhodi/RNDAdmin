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
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      images: [],
      imagesToDelete: {}
    }
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChemicalData = async () => {
      if (id) {
        setIsLoading(true); 
        try {
          const response = await axios.get(`/api/chemical/getChemicalById?id=${id}`);
          const chemicalData = response.data;
          
          // Set the values for category, sub_category, and subsub_category_id
          if (chemicalData.category) {
            setValue('category', chemicalData.category._id);
            setValue('categorySlug', chemicalData.category.slug);
          }
          if (chemicalData.sub_category) {
            setValue('sub_category', chemicalData.sub_category._id);
            setValue('subCategorySlug', chemicalData.sub_category.slug);
          }
          if (chemicalData.subsub_category_id) {
            setValue('subsub_category_id', chemicalData.subsub_category_id._id);
            setValue('subSubCategorySlug', chemicalData.subsub_category_id.slug);
          }

          // Set other values
          Object.entries(chemicalData).forEach(([key, value]) => {
            if (key !== 'category' && key !== 'sub_category' && key !== 'subsub_category_id') {
              setValue(key, value);
            }
          });

          if (chemicalData.images && chemicalData.images.length > 0) {
            setValue('images', chemicalData.images);
          }
        } catch (error) {
          console.error("Error fetching chemical data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchChemicalData();
  }, [id, setValue]);

  const onSubmitForm = async (data) => {
    try {
      const formData = new FormData();
  
      // Iterate over the images and append them along with their metadata
      data.images.forEach((image, index) => {
        if (image.file instanceof File) {
          formData.append('images', image.file);
          formData.append(`altText-${index}`, image.altText || '');
          formData.append(`title-${index}`, image.title || '');
        } else if (image.url) {
          formData.append(`existingImages[${index}][url]`, image.url);
          formData.append(`existingImages[${index}][altText]`, image.altText || '');
          formData.append(`existingImages[${index}][title]`, image.title || '');
        }
      });

      // Append images to delete
      Object.keys(data.imagesToDelete).forEach((imageId) => {
        formData.append('imagesToDelete[]', imageId);
      });
  
      // Append other form data, filtering out null, undefined, and empty string values
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'imagesToDelete' && value !== undefined && value !== null && value !== '') {
          // Convert numerical strings to numbers where appropriate
          if (key === 'molecular_weight' && value) {
            formData.append(key, Number(value));
          } else {
            formData.append(key, value);
          }
        }
      });
  
      let response;
      if (id) {
        response = await axios.put(`/api/chemical/updateChemicalById?id=${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post("/api/chemical/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      console.log("Form submitted successfully", response.data);
      navigate('/chemical-table');
    } catch (err) {
      console.error("Error submitting form:", err.response?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return <div>Loading existing chemical data...</div>;
  }

  return (
    <>
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-purple-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/chemical-table" className="hover:text-purple-600">Chemicals</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{id ? 'Edit Chemical' : 'New Chemical'}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Category Information</h2>
            <CategorySelectionForm
              control={control}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chemical Details</h2>
            <ChemicalInfoForm control={control} setValue={setValue} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Chemical Properties</h2>
            <ChemicalPropertiesForm control={control} />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            <ImageUploadForm
              control={control}
              setValue={setValue}
            />
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Meta Information</h2>
            <MetaInformationForm control={control} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="px-8 py-3 w-1/4 text-white rounded-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {id ? 'Update Chemical' : 'Submit Chemical'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChemicalFormPage;