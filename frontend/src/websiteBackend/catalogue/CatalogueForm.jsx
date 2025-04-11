import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCreateCatalogueMutation, useGetCatalogueByIdQuery, useUpdateCatalogueMutation } from "@/slice/catalogue/catalogueslice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { toast } from "react-toastify";

const CatalogueForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: catalogue, isLoading } = useGetCatalogueByIdQuery(id, { skip: !id });
  const [createCatalogue] = useCreateCatalogueMutation();
  const [updateCatalogue] = useUpdateCatalogueMutation();
  
  const [title, setTitle] = useState('');
  const [catalogueFile, setCatalogueFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (catalogue) {
      setTitle(catalogue.title || "");
    }
  }, [catalogue]);

  const handleFileChange = (e) => {
    setCatalogueFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (catalogueFile) formData.append('catalog', catalogueFile);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (id) {
        await updateCatalogue({ id, formData }).unwrap();
        toast.success('Catalogue updated successfully');
      } else {
        await createCatalogue(formData).unwrap();
        toast.success('Catalogue created successfully');
      }
      navigate('/catalogue-table');
    } catch (error) {
      toast.error('Failed to save catalogue');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/catalogue-table">Catalogue Table</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>{id ? 'Edit Catalogue' : 'Create Catalogue'}</BreadcrumbItem>
      </Breadcrumb>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="catalogue">Upload Catalogue</Label>
          <Input id="catalogue" type="file" accept=".pdf" onChange={handleFileChange} required />
        </div>

        <div>
          <Label htmlFor="image">Upload Image</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : id ? 'Update' : 'Create'}
        </Button>
      </form>
    </div>
  );
};

export default CatalogueForm;
