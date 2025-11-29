<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [chemicals, setChemicals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Fetch chemicals dynamically when the searchTerm changes
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setChemicals([]);
            return;
        }

        const fetchChemicals = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/chemical/search?query=${searchTerm}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch chemicals.');
                }
                const data = await response.json();
                setChemicals(data?.data || []);
            } catch (err) {
                setError(err.message || 'An error occurred.');
                setChemicals([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChemicals();
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChemicalSelect = (chemical) => {
        setShowSuggestions(false); // Hide suggestions
        setSearchTerm(""); // Clear the search term after selection
        navigate(`/search?tab=${chemical.slug}`); // Navigate to the search results page
    };
    
    const handleSearch = () => {
        const selectedChemical = chemicals.find((chemical) => chemical.name === searchTerm);
        if (selectedChemical?.slug) {
            setSearchTerm(""); // Clear the search term after search
            navigate(`/search?tab=${selectedChemical.slug}`); // Navigate to the search results page
        } else {
            alert('Please select a valid chemical to search.');
        }
    };
    

  

    return (
        <div className="relative w-full max-w-[35rem] pl-9 rounded-full mx-auto" ref={searchRef}>
            <div className="flex rounded-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    className="w-full px-4 py-2 border-2 rounded-l-full border-orange-500 focus:outline-none placeholder:text-sm"
                    placeholder="Product Code / Name / CAS / Grade"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>

            {isLoading && <p className="mt-2 text-gray-500">Loading...</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}

            {showSuggestions && searchTerm && chemicals.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-[400px] overflow-y-auto">
                    {chemicals.map((chemical) => (
                        <button
                            key={chemical._id}
                            onClick={() => handleChemicalSelect(chemical)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                            {chemical.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
=======
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [chemicals, setChemicals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Fetch chemicals dynamically when the searchTerm changes
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setChemicals([]);
            return;
        }

        const fetchChemicals = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/chemical/search?query=${searchTerm}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch chemicals.');
                }
                const data = await response.json();
                setChemicals(data?.data || []);
            } catch (err) {
                setError(err.message || 'An error occurred.');
                setChemicals([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChemicals();
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChemicalSelect = (chemical) => {
        setShowSuggestions(false); // Hide suggestions
        setSearchTerm(""); // Clear the search term after selection
        navigate(`/search?tab=${chemical.slug}`); // Navigate to the search results page
    };
    
    const handleSearch = () => {
        const selectedChemical = chemicals.find((chemical) => chemical.name === searchTerm);
        if (selectedChemical?.slug) {
            setSearchTerm(""); // Clear the search term after search
            navigate(`/search?tab=${selectedChemical.slug}`); // Navigate to the search results page
        } else {
            alert('Please select a valid chemical to search.');
        }
    };
    

  

    return (
        <div className="relative w-full max-w-[35rem] pl-9 rounded-full mx-auto" ref={searchRef}>
            <div className="flex rounded-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                    }}
                    className="w-full px-4 py-2 border-2 rounded-l-full border-orange-500 focus:outline-none placeholder:text-sm"
                    placeholder="Product Code / Name / CAS / Grade"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>

            {isLoading && <p className="mt-2 text-gray-500">Loading...</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}

            {showSuggestions && searchTerm && chemicals.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-[400px] overflow-y-auto">
                    {chemicals.map((chemical) => (
                        <button
                            key={chemical._id}
                            onClick={() => handleChemicalSelect(chemical)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                            {chemical.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
