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
    description: '',
    social: []
  });

  useEffect(() => {
    if (id) {
      const fetchFooter = async () => {
        try {
          const response = await axios.get(`/api/footer/getById?id=${id}`);
          const data = response.data.data;
          // Ensure social is an array
          setFormData({ ...data, social: data.social || [] });
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

  // Social Media Handlers
  const addSocial = () => {
    setFormData(prev => ({
      ...prev,
      social: [...prev.social, { icon: '', href: '' }]
    }));
  };

  const removeSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      social: prev.social.filter((_, i) => i !== index)
    }));
  };

  const handleSocialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSocial = [...formData.social];
    updatedSocial[index][name] = value;
    setFormData(prev => ({ ...prev, social: updatedSocial }));
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
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <Button type="button" size="sm" onClick={addSocial}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
          {formData.social.map((item, index) => (
            <div key={index} className="flex gap-4 items-end border p-4 rounded">
              <div className="flex-1">
                <Label>Icon Class</Label>
                <Input name="icon" value={item.icon} onChange={(e) => handleSocialChange(index, e)} placeholder="fa-brands fa-linkedin" />
              </div>
              <div className="flex-1">
                <Label>URL</Label>
                <Input name="href" value={item.href} onChange={(e) => handleSocialChange(index, e)} placeholder="https://..." />
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => removeSocial(index)}>
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
