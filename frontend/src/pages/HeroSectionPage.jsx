import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';

export default function HeroSectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
    marquee: [],
    socialMediaLinks: []
  });

  const [marqueeForm, setMarqueeForm] = useState({
    text: "",
    speed: 50,
    backgroundColor: "#000000",
    textColor: "#ffffff",
    isActive: true
  });

  const [socialMediaForm, setSocialMediaForm] = useState({
    platform: "",
    url: "",
    icon: ""
  });

  const [heroSections, setHeroSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch all hero sections
  const fetchHeroSections = async () => {
    try {
      const response = await axios.get('/api/heroSection');
      setHeroSections(response.data.data || []);
    } catch (error) {
      console.error("Error fetching hero sections:", error);
    }
  };

  // Fetch single hero section for edit
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/heroSection/${id}`);
          const data = response.data.data;
          setFormData({
            title: data.title || "",
            imageUrl: data.imageUrl || "",
            description: data.description || "",
            marquee: data.marquee || [],
            socialMediaLinks: data.socialMediaLinks || []
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      fetchHeroSections();
    }
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(`/api/heroSection/${id}`, formData);
      } else {
        await axios.post("/api/heroSection", formData);
      }
      setFormData({
        title: "",
        imageUrl: "",
        description: "",
        marquee: [],
        socialMediaLinks: []
      });
      fetchHeroSections();
      alert(id ? "Hero section updated!" : "Hero section created!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Marquee Operations
  const addMarquee = async () => {
    if (!marqueeForm.text.trim()) {
      alert("Please enter marquee text");
      return;
    }

    try {
      const heroId = id || formData._id;
      if (!heroId) {
        alert("Please save hero section first");
        return;
      }

      const response = await axios.post(`/api/heroSection/${heroId}/marquee`, marqueeForm);
      setFormData(prev => ({ ...prev, marquee: response.data.data.marquee }));
      setMarqueeForm({ text: "", speed: 50, backgroundColor: "#000000", textColor: "#ffffff", isActive: true });
      alert("Marquee added!");
    } catch (error) {
      console.error("Error adding marquee:", error);
      alert("Failed to add marquee");
    }
  };

  const deleteMarquee = async (heroId, marqueeId) => {
    if (!window.confirm("Delete this marquee?")) return;
    try {
      const response = await axios.delete(`/api/heroSection/${heroId}/marquee/${marqueeId}`);
      setFormData(prev => ({ ...prev, marquee: response.data.data.marquee }));
    } catch (error) {
      console.error("Error deleting marquee:", error);
    }
  };

  // Social Media Operations
  const addSocialMedia = async () => {
    if (!socialMediaForm.platform.trim() || !socialMediaForm.url.trim()) {
      alert("Please fill in platform and URL");
      return;
    }

    try {
      const heroId = id || formData._id;
      if (!heroId) {
        alert("Please save hero section first");
        return;
      }

      const response = await axios.post(`/api/heroSection/${heroId}/social-media`, socialMediaForm);
      setFormData(prev => ({ ...prev, socialMediaLinks: response.data.data.socialMediaLinks }));
      setSocialMediaForm({ platform: "", url: "", icon: "" });
      alert("Social media link added!");
    } catch (error) {
      console.error("Error adding social media:", error);
      alert("Failed to add social media link");
    }
  };

  const deleteSocialMedia = async (heroId, linkId) => {
    if (!window.confirm("Delete this social media link?")) return;
    try {
      const response = await axios.delete(`/api/heroSection/${heroId}/social-media/${linkId}`);
      setFormData(prev => ({ ...prev, socialMediaLinks: response.data.data.socialMediaLinks }));
    } catch (error) {
      console.error("Error deleting social media:", error);
    }
  };

  const deleteHeroSection = async (heroId) => {
    if (!window.confirm("Delete this hero section?")) return;
    try {
      await axios.delete(`/api/heroSection/${heroId}`);
      fetchHeroSections();
    } catch (error) {
      console.error("Error deleting hero section:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-3xl font-bold mb-6">{id ? "Edit" : "Add"} Hero Section</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleFormChange} placeholder="Hero title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} placeholder="Image URL" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input id="description" name="description" value={formData.description} onChange={handleFormChange} placeholder="Hero description" required />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : (id ? "Update Hero Section" : "Create Hero Section")}
          </Button>
        </form>
      </div>

      {/* Marquee Section */}
      {id && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Marquee Management</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="marqueeText">Marquee Text</Label>
              <Input id="marqueeText" value={marqueeForm.text} onChange={(e) => setMarqueeForm({ ...marqueeForm, text: e.target.value })} placeholder="Enter scrolling text" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Speed (px/s)</Label>
              <Input id="speed" type="number" value={marqueeForm.speed} onChange={(e) => setMarqueeForm({ ...marqueeForm, speed: parseInt(e.target.value) })} min="1" max="200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <input type="color" value={marqueeForm.backgroundColor} onChange={(e) => setMarqueeForm({ ...marqueeForm, backgroundColor: e.target.value })} className="w-12 h-10 border rounded" />
                <Input value={marqueeForm.backgroundColor} onChange={(e) => setMarqueeForm({ ...marqueeForm, backgroundColor: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <input type="color" value={marqueeForm.textColor} onChange={(e) => setMarqueeForm({ ...marqueeForm, textColor: e.target.value })} className="w-12 h-10 border rounded" />
                <Input value={marqueeForm.textColor} onChange={(e) => setMarqueeForm({ ...marqueeForm, textColor: e.target.value })} />
              </div>
            </div>
          </div>

          <Button onClick={addMarquee} className="w-full mb-4">
            <Plus size={16} className="mr-2" /> Add Marquee
          </Button>

          {formData.marquee.length > 0 && (
            <div className="space-y-2">
              {formData.marquee.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                  <span className="text-sm">{m.text} ({m.speed}px/s)</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteMarquee(id, m._id)}>
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Social Media Section */}
      {id && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Social Media Links</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Input id="platform" value={socialMediaForm.platform} onChange={(e) => setSocialMediaForm({ ...socialMediaForm, platform: e.target.value })} placeholder="e.g., Facebook, Twitter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input id="url" value={socialMediaForm.url} onChange={(e) => setSocialMediaForm({ ...socialMediaForm, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Class</Label>
              <Input id="icon" value={socialMediaForm.icon} onChange={(e) => setSocialMediaForm({ ...socialMediaForm, icon: e.target.value })} placeholder="e.g., fa-facebook" />
            </div>
          </div>

          <Button onClick={addSocialMedia} className="w-full mb-4">
            <Plus size={16} className="mr-2" /> Add Social Media Link
          </Button>

          {formData.socialMediaLinks.length > 0 && (
            <div className="space-y-2">
              {formData.socialMediaLinks.map((link, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                  <span className="text-sm">{link.platform} - {link.url}</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteSocialMedia(id, link._id)}>
                    <Trash size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero Sections List */}
      {!id && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4">Hero Sections</h3>

          <div className="space-y-3">
            {heroSections.map((hero) => (
              <div key={hero._id} className="border rounded-lg">
                <button
                  onClick={() => setExpandedId(expandedId === hero._id ? null : hero._id)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                >
                  <div className="text-left">
                    <h4 className="font-semibold">{hero.title}</h4>
                    <p className="text-sm text-gray-600">{hero.description}</p>
                  </div>
                  {expandedId === hero._id ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedId === hero._id && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="font-semibold">Marquees: {hero.marquee?.length || 0}</p>
                        {hero.marquee?.map((m, i) => <p key={i} className="text-xs text-gray-600">{m.text}</p>)}
                      </div>
                      <div>
                        <p className="font-semibold">Social Links: {hero.socialMediaLinks?.length || 0}</p>
                        {hero.socialMediaLinks?.map((link, i) => <p key={i} className="text-xs text-gray-600">{link.platform}</p>)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => navigate(`/hero-sections?id=${hero._id}`)}>
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" onClick={() => deleteHeroSection(hero._id)}>
                        <Trash size={16} className="mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
