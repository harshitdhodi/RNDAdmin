import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCreateNavigationLinkMutation, useUpdateNavigationLinkMutation, useGetNavigationLinkByIdQuery } from "@/slice/navigationLink/navigationSlice";

const NavigationLinkForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: navigationLink, isLoading } = useGetNavigationLinkByIdQuery(id, { skip: !id });
  const [createNavigationLink] = useCreateNavigationLinkMutation();
  const [updateNavigationLink] = useUpdateNavigationLinkMutation();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (navigationLink) {
      setName(navigationLink.name);
      if (navigationLink.icon) {
        setPreview(`/api/logo/download/${navigationLink.icon}`);
      }
    }
  }, [navigationLink]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (file) {
      formData.append("icon", file);
    }
    try {
      if (id) {
        await updateNavigationLink({ id, formData }).unwrap();
        toast({ title: "Success", description: "Navigation link updated successfully", variant: "success" });
      } else {
        await createNavigationLink(formData).unwrap();
        toast({ title: "Success", description: "Navigation link created successfully", variant: "success" });
      }
      navigate("/navigationLink");
    } catch (error) {
      toast({ title: "Error", description: "Failed to save navigation link", variant: "destructive" });
    }
  };

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <Breadcrumb items={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Navigation Links", link: "/navigationLink" },
        { label: id ? "Edit Navigation Link" : "Add Navigation Link" },
      ]} className="mb-4" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          {preview && <img src={preview} alt="Preview" className="w-16 h-16 mb-2" />}
          <input type="file" id="icon" accept="image/*" onChange={handleFileChange} />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </Card>
  );
};

export default NavigationLinkForm;
