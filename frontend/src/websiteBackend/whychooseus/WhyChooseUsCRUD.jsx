import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';

const WhyChooseUsCRUD = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    categoryId: '',
    subCategoryId: '',
    subSubCategoryId: ''
  });

  const [formData, setFormData] = useState({
    heading: '',
    subheading: '',
    details: '',
    photo: null,
    alt: '',
    imgTitle: '',
    cards: [],
    categoryId: '',
    subCategoryId: '',
    subSubCategoryId: ''
  });

  const [previewImages, setPreviewImages] = useState({
    main: null,
    cards: []
  });

  // Fetch data
  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...searchFilters
      });
      const response = await fetch(`/api/why-choose-us?${queryParams}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/services/getAll');
      const result = await response.json();
      console.log('Categories:', result);
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [currentPage, searchFilters]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'main') {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => ({ ...prev, main: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (type === 'card') {
      const newCards = [...formData.cards];
      newCards[index].photo = file;
      setFormData(prev => ({ ...prev, cards: newCards }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => {
          const newCardPreviews = [...prev.cards];
          newCardPreviews[index] = reader.result;
          return { ...prev, cards: newCardPreviews };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new card
  const addCard = () => {
    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, { title: '', subTitle: '', description: '', photo: null, alt: '', imgTitle: '' }]
    }));
    setPreviewImages(prev => ({
      ...prev,
      cards: [...prev.cards, null]
    }));
  };

  // Remove card
  const removeCard = (index) => {
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  // Handle card input change
  const handleCardChange = (index, field, value) => {
    const newCards = [...formData.cards];
    newCards[index][field] = value;
    setFormData(prev => ({ ...prev, cards: newCards }));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('heading', formData.heading);
    formDataToSend.append('subheading', formData.subheading);
    formDataToSend.append('details', formData.details);
    formDataToSend.append('alt', formData.alt);
    formDataToSend.append('imgTitle', formData.imgTitle);
    formDataToSend.append('categoryId', formData.categoryId);
    if (formData.subCategoryId) formDataToSend.append('subCategoryId', formData.subCategoryId);
    if (formData.subSubCategoryId) formDataToSend.append('subSubCategoryId', formData.subSubCategoryId);
    
    // Append main photo first
    if (formData.photo instanceof File) {
      formDataToSend.append('photo', formData.photo);
    }

    // Process cards data (without files)
    const cardsData = formData.cards.map((card) => {
      return {
        title: card.title,
        subTitle: card.subTitle,
        description: card.description,
        alt: card.alt,
        imgTitle: card.imgTitle,
        // Keep existing photo path if it's a string (for updates)
        photo: (card.photo && typeof card.photo === 'string') ? card.photo : ''
      };
    });
    
    formDataToSend.append('cards', JSON.stringify(cardsData));

    // Append all card photos after main photo (order matters!)
    formData.cards.forEach((card) => {
      if (card.photo instanceof File) {
        formDataToSend.append('photo', card.photo);
      }
    });

    try {
      const url = editingId ? `/api/why-choose-us/${editingId}` : '/api/why-choose-us';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      const result = await response.json();
      if (result.success) {
        fetchData();
        resetForm();
        alert(editingId ? 'Updated successfully!' : 'Created successfully!');
      } else {
        alert(result.message || 'Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setFormData({
      heading: item.heading || '',
      subheading: item.subheading || '',
      details: item.details || '',
      photo: item.photo || null,
      alt: item.alt || '',
      imgTitle: item.imgTitle || '',
      cards: item.cards || [],
      categoryId: item.categoryId?._id || item.categoryId || '',
      subCategoryId: item.subCategoryId || '',
      subSubCategoryId: item.subSubCategoryId || ''
    });
    setPreviewImages({
      main: item.photo ? `/api/image/download/${item.photo}` : null,
      cards: item.cards?.map(card => card.photo ? `/api/image/download/${card.photo}` : null) || []
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`/api/why-choose-us/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        fetchData();
        alert('Deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      heading: '',
      subheading: '',
      details: '',
      photo: null,
      alt: '',
      imgTitle: '',
      cards: [],
      categoryId: '',
      subCategoryId: '',
      subSubCategoryId: ''
    });
    setPreviewImages({ main: null, cards: [] });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Why Choose Us Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? 'Close' : 'Add New'}
            </button>
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={searchFilters.categoryId}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add New'} Why Choose Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                  <input
                    type="text"
                    name="subheading"
                    value={formData.subheading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'main')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {previewImages.main && (
                    <img src={previewImages.main} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                  <input
                    type="text"
                    name="alt"
                    value={formData.alt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Title</label>
                  <input
                    type="text"
                    name="imgTitle"
                    value={formData.imgTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cards Section */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Cards</h3>
                  <button
                    onClick={addCard}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <Plus size={16} /> Add Card
                  </button>
                </div>

                {formData.cards.map((card, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Card {index + 1}</h4>
                      <button
                        onClick={() => removeCard(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={card.subTitle}
                          onChange={(e) => handleCardChange(index, 'subTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={card.description}
                          onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'card', index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {previewImages.cards[index] && (
                          <img src={previewImages.cards[index]} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={card.alt}
                          onChange={(e) => handleCardChange(index, 'alt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Save size={18} />
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Heading</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cards</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.heading}</div>
                      <div className="text-sm text-gray-500">{item.subheading}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.categoryId?.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.cards?.length || 0} cards
                    </td>
                    <td className="px-6 py-4">
                      {item.photo && (
                        <img 
                          src={`/api/image/download/${item.photo}`} 
                          alt={item.alt}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsCRUD;