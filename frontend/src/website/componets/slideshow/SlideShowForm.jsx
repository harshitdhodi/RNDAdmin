import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { useToast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

const ImageUploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
;

  const form = useForm({
    defaultValues: {
      title: "",
      altText: "",
    },
  });

  const onSubmit = async (values) => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please upload an image.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("altText", values.altText);
    formData.append("title", values.title);

    setLoading(true);
    try {
      const response = await axios.post("/api/slideShow/addimages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
        variant: "default",
      });
      navigate("/slideShow-table");
      console.log("Response:", response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload image.",
      });
      console.error(error);
    } finally {
      setLoading(false);
      setFile(null);
      setPreview(null);
      form.reset();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center px-6">
      {/* Breadcrumb Navigation */}
      <div className="w-full max-w-4xl mb-4">
        <Breadcrumb className="text-gray-600">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/slideShow-table">SlideShow Table</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Upload Image</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="w-full max-w-4xl shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-1/2 space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Please enter image title" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="altText"
                rules={{ required: "Please enter alt text" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter alt text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <div className="grid w-full items-center gap-1.5">
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className={cn(
                          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
                          "hover:bg-gray-50 bg-gray-50 border-gray-300",
                          preview && "border-blue-500 bg-blue-50"
                        )}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {!preview ? (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                            </>
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={preview}
                                alt="Preview"
                                className="max-h-24 max-w-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeFile();
                                }}
                                className="absolute top-0 right-0 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadForm;