import React, { useState } from 'react';
import { useUpdateLogoMutation, useGetLogoQuery } from '@/slice/logo/LogoSlice';

const LogoForm = () => {
    const [updateLogo, { isLoading }] = useUpdateLogoMutation();
    const { data: existingLogo } = useGetLogoQuery();
    
    const [preview, setPreview] = useState({
        headerLogo: null,
        favIcon: null
    });

    // Function to get image URL
    const getImageUrl = (filename) => {
        if (!filename) return null;
        return `/api/logo/download/${filename}`;
    };

    // Handle file selection
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setPreview(prev => ({
                ...prev,
                [type]: previewUrl
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            const headerLogoInput = document.querySelector('input[name="headerLogo"]');
            const favIconInput = document.querySelector('input[name="favIcon"]');

            if (headerLogoInput.files[0]) {
                formData.append('headerLogo', headerLogoInput.files[0]);
            }
            if (favIconInput.files[0]) {
                formData.append('favIcon', favIconInput.files[0]);
            }

            await updateLogo(formData).unwrap();
            
            // Clear previews after successful upload
            setPreview({ headerLogo: null, favIcon: null });
            
            // Reset form
            e.target.reset();
            
            alert('Logo updated successfully!');
        } catch (err) {
            console.error('Failed to update logo:', err);
            alert('Failed to update logo. Please try again.');
        }
    };

    // Cleanup preview URLs when component unmounts
    React.useEffect(() => {
        return () => {
            if (preview.headerLogo) URL.revokeObjectURL(preview.headerLogo);
            if (preview.favIcon) URL.revokeObjectURL(preview.favIcon);
        };
    }, [preview]);

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white ">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Update Company Logo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Logo Upload */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Header Logo
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="mt-2">
                        <input
                            type="file"
                            name="headerLogo"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'headerLogo')}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                transition-all duration-200
                                border border-gray-300 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Show preview or existing header logo */}
                    {(preview.headerLogo || existingLogo?.headerLogo) && (
                        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img
                                src={preview.headerLogo || getImageUrl(existingLogo?.headerLogo)}
                                alt="Header Logo Preview"
                                className="h-20 object-contain bg-white"
                            />
                        </div>
                    )}
                </div>

                {/* Favicon Upload */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Favicon
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="mt-2">
                        <input
                            type="file"
                            name="favIcon"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'favIcon')}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2.5 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                transition-all duration-200
                                border border-gray-300 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Show preview or existing favicon */}
                    {(preview.favIcon || existingLogo?.favIcon) && (
                        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img
                                src={preview.favIcon || getImageUrl(existingLogo?.favIcon)}
                                alt="Favicon Preview"
                                className="h-20 w-20 object-contain bg-white"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full sm:w-1/4 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                            ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 transform transition-all duration-200 hover:shadow-md'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        {isLoading ? 'Updating...' : 'Update Logo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogoForm;