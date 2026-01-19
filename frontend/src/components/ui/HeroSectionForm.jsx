import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HeroSectionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null,
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/heroSection/${id}`);
          const data = response.data.data;
          setFormData({
            title: data.title || "",
            subtitle: data.subtitle || "",
            image: data.image || null,
          });
          if (data.image) {
            setPreview(`/api/logo/download/${data.image}`);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    // Only append image if it's a new file (object), not if it's an existing string URL
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      if (id) {
        await axios.put(`/api/heroSection/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/heroSection", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/hero-section-table");
    } catch (error) {
      console.error("Error saving hero section:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{id ? "Edit" : "Add"} Hero Section</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Enter subtitle" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Background Image</Label>
          <Input id="image" type="file" onChange={handleFileChange} accept="image/*" className="cursor-pointer" />
          {preview && <div className="mt-4"><p className="text-sm text-gray-500 mb-2">Preview:</p><img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md border" /></div>}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/hero-section-table")}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Hero Section"}</Button>
        </div>
      </form>
    </div>
  );
}