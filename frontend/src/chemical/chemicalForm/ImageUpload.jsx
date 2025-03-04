import React, { useCallback, useEffect } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ImageUploadForm = ({ control, setValue }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "images",
  });

  const handleImageChange = useCallback(
    (e, index) => {
      const file = e.target.files[0];
      if (file) {
        // Revoke the old preview URL if it exists
        if (fields[index]?.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(fields[index].preview);
        }

        const preview = URL.createObjectURL(file);

        // Update the specific index using update() instead of modifying fields directly
        update(index, {
          ...fields[index],
          file,
          preview,
          altText: fields[index]?.altText || "",
          title: fields[index]?.title || "",
          url: null, // Reset URL for new uploads
        });
      }
    },
    [fields, update]
  );

  // Cleanup effect to revoke old preview URLs
  useEffect(() => {
    return () => {
      fields.forEach((field) => {
        if (field?.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(field.preview);
        }
      });
    };
  }, [fields]);

  const handleRemove = useCallback(
    (index) => {
      if (fields[index]?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(fields[index].preview);
      }
      // Mark the image for deletion if it has an ID
      if (fields[index]._id) {
        setValue(`imagesToDelete.${fields[index]._id}`, true);
      }
      remove(index);
    },
    [fields, remove, setValue]
  );

  return (
    <div className="space-y-6">
      <Label>Images</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border p-4 rounded-lg">
          {/* Image Preview */}
          {field.preview || field.url ? (
            <img
              src={field.preview || `/api/image/download/${field.url}`}
              alt={field.altText || "Image preview"}
              className="w-32 h-32 object-cover rounded border"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center border rounded bg-gray-100">
              No Preview
            </div>
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
            render={({ field }) => (
              <Input
                id={`alt-text-${index}`}
                placeholder="Alt Text"
                {...field}
              />
            )}
          />

          {/* Title Input */}
          <Label htmlFor={`image-title-${index}`}>Image Title</Label>
          <Controller
            name={`images.${index}.title`}
            control={control}
            defaultValue={field.title || ""}
            render={({ field }) => (
              <Input
                id={`image-title-${index}`}
                placeholder="Image Title"
                {...field}
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
        onClick={() =>
          append({ file: null, preview: null, altText: "", title: "", url: null })
        }
        className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Image
      </button>
    </div>
  );
};

export default ImageUploadForm;