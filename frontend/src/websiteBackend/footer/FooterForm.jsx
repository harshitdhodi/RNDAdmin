import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';

const FooterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    linkHeading: '',
    description: '',
    contactInfo: {
      address: '',
      phone: '',
      email: '',
      link: ''
    },
    socialMedia: [],
    links: []
  });

  useEffect(() => {
    if (id) {
      const fetchFooter = async () => {
        try {
          const response = await axios.get(`/api/footer/getById?id=${id}`);
          const data = response.data.data;
          setFormData({
            linkHeading: data.linkHeading || '',
            description: data.description || '',
            contactInfo: {
              address: data.contactInfo?.address || '',
              phone: data.contactInfo?.phone || '',
              email: data.contactInfo?.email || '',
              link: data.contactInfo?.link || ''
            },
            socialMedia: data.socialMedia || [],
            links: data.links || []
          });
        } catch (error) {
          console.error("Error fetching footer details:", error);
        }
      };
      fetchFooter();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [name]: value }
    }));
  };

  // Social Media Handlers
  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: '', url: '', icon: '' }]
    }));
  };

  const removeSocialMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSocial = [...formData.socialMedia];
    updatedSocial[index][name] = value;
    setFormData(prev => ({ ...prev, socialMedia: updatedSocial }));
  };

  // Links Handlers
  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { title: '', url: '' }]
    }));
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLinks = [...formData.links];
    updatedLinks[index][name] = value;
    setFormData(prev => ({ ...prev, links: updatedLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/footer/update?id=${id}`, formData);
        alert("Footer updated successfully!");
      } else {
        await axios.post('/api/footer/add', formData);
        alert("Footer created successfully!");
      }
      navigate('/footer-table');
    } catch (error) {
      console.error("Error saving footer:", error);
      alert("Failed to save footer.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Footer' : 'Add New Footer'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Information</h3>
          <div>
            <Label htmlFor="linkHeading">Link Heading</Label>
            <Input id="linkHeading" name="linkHeading" value={formData.linkHeading} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.contactInfo.address} onChange={handleContactChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.contactInfo.phone} onChange={handleContactChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.contactInfo.email} onChange={handleContactChange} />
            </div>
            <div>
              <Label htmlFor="link">Contact Link (Map/Other)</Label>
              <Input id="link" name="link" value={formData.contactInfo.link} onChange={handleContactChange} />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <Button type="button" size="sm" onClick={addSocialMedia}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
          {formData.socialMedia.map((item, index) => (
            <div key={index} className="flex gap-4 items-end border p-4 rounded">
              <div className="flex-1">
                <Label>Platform</Label>
                <Input name="platform" value={item.platform} onChange={(e) => handleSocialMediaChange(index, e)} placeholder="e.g. Facebook" />
              </div>
              <div className="flex-1">
                <Label>URL</Label>
                <Input name="url" value={item.url} onChange={(e) => handleSocialMediaChange(index, e)} placeholder="https://..." />
              </div>
              <div className="flex-1">
                <Label>Icon Class</Label>
                <Input name="icon" value={item.icon} onChange={(e) => handleSocialMediaChange(index, e)} placeholder="fa-brands fa-facebook" />
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => removeSocialMedia(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <Button type="button" size="sm" onClick={addLink}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
          {formData.links.map((item, index) => (
            <div key={index} className="flex gap-4 items-end border p-4 rounded">
              <div className="flex-1">
                <Label>Title</Label>
                <Input name="title" value={item.title} onChange={(e) => handleLinkChange(index, e)} placeholder="Link Title" />
              </div>
              <div className="flex-1">
                <Label>URL</Label>
                <Input name="url" value={item.url} onChange={(e) => handleLinkChange(index, e)} placeholder="/path" />
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => removeLink(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/footer-table')}>
            Cancel
          </Button>
          <Button type="submit">
            {id ? 'Update Footer' : 'Create Footer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FooterForm;
