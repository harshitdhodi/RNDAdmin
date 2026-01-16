import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from 'react-router-dom';

const VideoForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [formData, setFormData] = useState({
    heading: '',
    subheading: '',
    description: '',
    alt: '',
    imgTitle: '',
    video: null,
    image: null
  });

  const [preview, setPreview] = useState({
    video: null,
    image: null
  });

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await axios.get(`/api/video/getVideoById?id=${id}`);
          const data = response.data;
          setFormData({
            heading: data.heading,
            subheading: data.subheading,
            description: data.description,
            alt: data.alt,
            imgTitle: data.imgTitle,
            video: null, // Keep null to detect new uploads
            image: null
          });
          setPreview({
            video: data.video ? `/uploads/${data.video}` : null,
            image: data.image ? `/uploads/${data.image}` : null
          });
        } catch (error) {
          console.error("Error fetching video details:", error);
        }
      };
      fetchVideo();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setPreview(prev => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('heading', formData.heading);
    data.append('subheading', formData.subheading);
    data.append('description', formData.description);
    data.append('alt', formData.alt);
    data.append('imgTitle', formData.imgTitle);
    if (formData.video) data.append('video', formData.video);
    if (formData.image) data.append('image', formData.image);

    try {
      if (id) {
        await axios.put(`/api/video/updateVideo?id=${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Video updated successfully!");
      } else {
        await axios.post('/api/video/createVideo', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Video created successfully!");
      }
      navigate('/video-table');
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save video.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Video' : 'Add New Video'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <Label htmlFor="heading">Heading</Label>
          <Input id="heading" name="heading" value={formData.heading} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="subheading">Subheading</Label>
          <Input id="subheading" name="subheading" value={formData.subheading} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input id="alt" name="alt" value={formData.alt} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="imgTitle">Image Title</Label>
            <Input id="imgTitle" name="imgTitle" value={formData.imgTitle} onChange={handleChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="image">Upload Image (Optional)</Label>
          <Input id="image" type="file" name="image" accept="image/*" onChange={handleFileChange} />
          {preview.image && <img src={preview.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
        </div>

        <div>
          <Label htmlFor="video">Upload Video (Optional)</Label>
          <Input id="video" type="file" name="video" accept="video/*" onChange={handleFileChange} />
          {preview.video && (
            <video src={preview.video} controls className="mt-2 h-32 object-cover rounded" />
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/video-table')}>
            Cancel
          </Button>
          <Button type="submit">
            {id ? 'Update Video' : 'Create Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;