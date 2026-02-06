import React, { useState, useEffect } from 'react';
import { useAddUserMutation, useUpdateUserMutation, useGetAllUsersQuery } from '@/slice/contactInfo/contactInfo';
import { MapPin, Phone, Mail, LinkIcon } from 'lucide-react';

const ContactInfoForm = () => {
    const [formData, setFormData] = useState({
        address: '',
        mobiles: [''],
        emails: [''],
        imgTitle: [''],
        altName: [''],
        photo: [],
        previewUrls: [],
        mapLink: '',
        hrEmail: '',
        hrPhone: ''
    });

    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const { data: allUsers } = useGetAllUsersQuery();

    // Populate form with existing data when component loads
    useEffect(() => {
        if (allUsers && allUsers.length > 0) {
            const existingData = allUsers[0];
            setFormData({
                address: existingData.address || '',
                mobiles: existingData.mobiles || [''],
                emails: existingData.emails || [''],
                imgTitle: existingData.imgTitle || [''],
                altName: existingData.altName || [''],
                photo: [],
                previewUrls: existingData.photo ? existingData.photo.map(p => `/api/image/download/${p}`) : [],
                mapLink: existingData.mapLink || '',
                hrEmail: existingData.hrEmail || '',
                hrPhone: existingData.hrPhone || ''
            });
        }
    }, [allUsers]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        
        setFormData(prev => ({
            ...prev,
            photo: files,
            previewUrls: [...newPreviewUrls],
            imgTitle: files.map(() => ''),
            altName: files.map(() => '')
        }));
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            formData.previewUrls.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [formData.previewUrls]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitFormData = new FormData();
        submitFormData.append('address', formData.address);
        submitFormData.append('mapLink', formData.mapLink);
        submitFormData.append('hrEmail', formData.hrEmail);
        submitFormData.append('hrPhone', formData.hrPhone);
        
        formData.mobiles.forEach(mobile => {
            submitFormData.append('mobiles[]', mobile);
        });
        formData.emails.forEach(email => {
            submitFormData.append('emails[]', email);
        });
        
        // Handle arrays for image-related fields
        formData.imgTitle.forEach((title, index) => {
            submitFormData.append('imgTitle[]', title);
        });
        
        formData.altName.forEach((alt, index) => {
            submitFormData.append('altName[]', alt);
        });
        
        // Handle multiple photo uploads
        if (formData.photo.length > 0) {
            formData.photo.forEach(file => {
                submitFormData.append('photo[]', file);
            });
        } else if (allUsers && allUsers[0]?.photo) {
            // If no new photos selected, keep the existing ones
            allUsers[0].photo.forEach(photoUrl => {
                submitFormData.append('photo[]', photoUrl);
            });
        }

        try {
            if (allUsers && allUsers.length > 0) {
                await updateUser({ 
                    id: allUsers[0]._id, 
                    formData: submitFormData 
                }).unwrap();
                alert('Contact information updated successfully!');
            } else {
                await addUser(submitFormData).unwrap();
                alert('Contact information added successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving contact information. Please try again.');
        }
    };

    return (
        <div className="min-h-screen ">
            <div className="max-w-3xl ">
                {/* Header */}
                <div className="bg-white rounded-t-2xl  p-2 border-b-4 border-indigo-600">
                    <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
                  
                </div>

                {/* Form */}
                <div className="bg-white rounded-b-2xl  p-5 space-y-6">
                    {/* Address Field */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                            Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                address: e.target.value
                            }))}
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            placeholder="Enter your business address"
                            required
                        />
                    </div>

                    {/* Map Link Field */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <LinkIcon className="w-5 h-5 mr-2 text-indigo-600" />
                            Map Link
                        </label>
                        <input
                            type="url"
                            value={formData.mapLink}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                mapLink: e.target.value
                            }))}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    {/* Mobile Numbers */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                            Mobile Numbers
                        </label>
                        {formData.mobiles.map((mobile, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setFormData(prev => {
                                        const newArray = [...prev.mobiles];
                                        newArray[index] = e.target.value;
                                        return {
                                            ...prev,
                                            mobiles: newArray
                                        };
                                    })}
                                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    placeholder="+91 XXXXX XXXXX"
                                    required
                                />
                                {formData.mobiles.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData(prev => {
                                            const newArray = [...prev.mobiles];
                                            newArray.splice(index, 1);
                                            return {
                                                ...prev,
                                                mobiles: newArray
                                            };
                                        })} 
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                mobiles: [...prev.mobiles, '']
                            }))} 
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                        >
                            <span className="text-xl">+</span> Add Mobile Number
                        </button>
                    </div>

                    {/* HR Email */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                            HR Email
                        </label>
                        <input
                            type="email"
                            value={formData.hrEmail}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                hrEmail: e.target.value
                            }))}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            placeholder="hr@example.com"
                        />
                    </div>

                    {/* HR Phone */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                            HR Phone
                        </label>
                        <input
                            type="tel"
                            value={formData.hrPhone}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                hrPhone: e.target.value
                            }))}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>

                    {/* Emails */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                            Email Addresses
                        </label>
                        {formData.emails.map((email, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setFormData(prev => {
                                        const newArray = [...prev.emails];
                                        newArray[index] = e.target.value;
                                        return {
                                            ...prev,
                                            emails: newArray
                                        };
                                    })}
                                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    placeholder="contact@example.com"
                                    required
                                />
                                {formData.emails.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => setFormData(prev => {
                                            const newArray = [...prev.emails];
                                            newArray.splice(index, 1);
                                            return {
                                                ...prev,
                                                emails: newArray
                                            };
                                        })} 
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                emails: [...prev.emails, '']
                            }))} 
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                        >
                            <span className="text-xl">+</span> Add Email Address
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {allUsers && allUsers.length > 0 ? '✓ Update Contact Information' : '+ Add Contact Information'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoForm;