import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function HeroSectionTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/heroSection");
      // Adjust based on your actual API response structure
      setData(response.data.data || []); 
    } catch (error) {
      console.error("Error fetching hero sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/heroSection/${id}`);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md m-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Hero Sections</h2>
        <Link to="/hero-section-form">
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add New
          </Button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Subtitle</th>
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.subtitle}</td>
                  <td className="p-3">
                    {item.image && (
                      <img 
                        src={`/api/logo/download/${item.image}`} 
                        alt={item.title} 
                        className="h-12 w-20 object-cover rounded" 
                      />
                    )}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link to={`/hero-section-form?id=${item._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No hero sections found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}