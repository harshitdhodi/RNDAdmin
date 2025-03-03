import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [chemicals, setChemicals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    // Add debounce to prevent excessive re-renders
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000); // 1 second debounce

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setChemicals([]);
            return;
        }

        const fetchChemicals = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/chemical/search?query=${debouncedSearchTerm}`);
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
    }, [debouncedSearchTerm]);


    // Click outside effect
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
        setShowSuggestions(false);
        setIsExpanded(false);
        navigate(`/search?tab=${chemical.slug}`);
    };

    const handleSearch = () => {
        const selectedChemical = chemicals.find((chemical) => chemical.name === searchTerm);
        if (selectedChemical?.slug) {
            // setSearchTerm("");
            setIsExpanded(false);
            navigate(`/search?tab=${selectedChemical.slug}`);
        } else {
            alert('Please select a valid chemical to search.');
        }
    };
    // Restore focus after searchTerm updates
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus(); // Force focus back to the input
        }
    }, [searchTerm]);

    // Improved input change handler
    const handleInputChange = (e) => {
        const { selectionStart, selectionEnd } = e.target;
        setSearchTerm(e.target.value);

        setShowSuggestions(true);

        requestAnimationFrame(() => {
            if (searchInputRef.current) {
                searchInputRef.current.setSelectionRange(selectionStart, selectionEnd);
            }
        });
    };



    // Desktop Search Bar Component
    const DesktopSearchBar = () => (
        <div className="hidden md:block relative w-full max-w-[35rem] mx-auto" ref={searchRef}>
            <div className="flex rounded-full">
                <input
                    ref={searchInputRef}  // Ensure ref is attached
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
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
            {/* Desktop Suggestions */}
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

    // Mobile Search Bar Component
    const MobileSearchBar = () => (
        <div className="md:hidden" ref={searchRef}>
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="px-4 py-2 text-orange-500 rounded-full hover:bg-orange-600 focus:outline-none"
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
            ) : (
                <div className="fixed inset-x-0 top-[4rem] bg-white shadow-lg z-50 px-4 py-3">
                    <div className="max-w-[35rem] mx-auto">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-1 rounded-full">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border-2 rounded-l-full border-orange-500 focus:outline-none placeholder:text-sm"
                                    placeholder="Product Code / Name / CAS / Grade"
                                    autoFocus
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
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setSearchTerm('');
                                    setShowSuggestions(false);
                                }}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {/* Mobile Suggestions */}
                        {showSuggestions && searchTerm && chemicals.length > 0 && (
                            <div className="mt-2 bg-white border border-gray-200 rounded shadow-lg max-h-[300px] overflow-y-auto">
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
                </div>
            )}
        </div>
    );

    return (
        <>
            <DesktopSearchBar />
            <MobileSearchBar />
            {isLoading && <p className="mt-2 text-gray-500">Loading...</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </>
    );
}