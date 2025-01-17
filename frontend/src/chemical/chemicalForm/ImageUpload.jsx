import React, { useCallback, useEffect } from "react";
import { useFieldArray, Controller, useController } from "react-hook-form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ImageUploadForm = ({ control, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const handleImageChange = useCallback((e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke the old preview URL if it exists
      if (fields[index]?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(fields[index].preview);
      }

      const preview = URL.createObjectURL(file);
      
      // Create a new fields array instead of modifying the existing one
      const updatedFields = [...fields];
      updatedFields[index] = {
        ...updatedFields[index],
        file: file,
        preview: preview,
        altText: fields[index]?.altText || "",
        title: fields[index]?.title || "",
        url: fields[index]?.url || null
      };

      // Update the form with the new array
      setValue('images', updatedFields, { shouldValidate: true });
    }
  }, [fields, setValue]);

  // Modify the cleanup effect to handle removal
  useEffect(() => {
    return () => {
      fields.forEach(field => {
        if (field?.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(field.preview);
        }
      });
    };
  }, [fields]);

  // Add cleanup when removing an image
  const handleRemove = useCallback((index) => {
    if (fields[index]?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(fields[index].preview);
    }
    remove(index);
  }, [fields, remove]);

  return (
    <div className="space-y-6">
      {/* Global Tagline Field */}
      <div className="space-y-2">
        <Label htmlFor="global_tagline">Global Tagline</Label>
        <Controller
          name="global_tagline"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input 
              id="global_tagline"
              placeholder="Enter global tagline"
              rows={2}
              {...field} 
            />
          )}
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <ReactQuill 
              id="description"
              theme="snow"
              value={value}
              onChange={onChange}
              className="bg-white"
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['clean']
                ]
              }}
            />
          )}
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label>Images</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            {/* Image Preview */}
            {field && (field.url || field.preview) && (
              <img
                src={field.preview || `/api/image/download/${field.url}`}
                alt={field.altText || "Image preview"}
                className="w-32 h-32 object-cover rounded"
              />
            )}
            
            {/* File Input */}
            <input
              type="file"
              onChange={(e) => handleImageChange(e, index)}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />

            {/* Alt Text Input */}
            <Label htmlFor={`alt-text-${index}`}>Alt Text</Label>
            <Controller
              name={`images.${index}.altText`}
              control={control}
              defaultValue={field.altText || ""}
              render={({ field: altTextField }) => (
                <input
                  id={`alt-text-${index}`}
                  placeholder="Alt Text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  {...altTextField}
                />
              )}
            />

            {/* Title Input */}
            <Label htmlFor={`image-title-${index}`}>Image Title</Label>
            <Controller
              name={`images.${index}.title`}
              control={control}
              defaultValue={field.title || ""}
              render={({ field: titleField }) => (
                <input
                  id={`image-title-${index}`}
                  placeholder="Image Title"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  {...titleField}
                />
              )}
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Add Image Button */}
        <button
          type="button"
          onClick={() => {
            append({
              file: null,
              preview: null,
              altText: "",
              title: "",
              url: null
            });
          }}
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Image
        </button>
      </div>
    </div>
  );
};

export default ImageUploadForm;

