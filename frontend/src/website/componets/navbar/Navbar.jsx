import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCircle, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "./NavLink";
import image from "../../images/logo.png";
import { useGetAllCategoriesQuery,  } from "@/slice/blog/blogCategory";
import SearchBar from "./SearchBar";
import Footer from "../home/Footer";
import { useGetLogoQuery } from "@/slice/logo/LogoSlice";

// Helper function to check if the current path matches any of the given paths
const isPathMatch = (pathname, paths) => {
    return paths.some(path => pathname.startsWith(path));
};

const HOVER_DELAY = 500; // Increase delay to 500ms

export default function NavbarComp({ categories }) {
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
    const [corporateDropdownOpen, setCorporateDropdownOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    
    // Fetch blog categories from API
    const { data: blogCategories = [], isLoading } = useGetAllCategoriesQuery();

    // Parsing blog categories into the format required for display
    const parsedBlogCategories = blogCategories.map((blog) => ({
        id: blog._id,
        name: blog.category,
        slug: blog.slug,
    }));
console.log(parsedBlogCategories)
    // Get the current pathname
    const { pathname } = useLocation();

    // Custom isActive checks for specific routes
    const isHomeActive = pathname === '/' || pathname === '/home';
    const isProductsActive = pathname.startsWith('/categories');
    const isBlogActive = pathname.startsWith('/blogs');
    const isContactActive = pathname.startsWith('/contact-us');

    const navigate = useNavigate();

    // Add scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            setIsSticky(scrollPercent >= 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add this query
    const { data: logoData } = useGetLogoQuery();

    // Add useEffect for favicon
    useEffect(() => {
        if (logoData?.favIcon) {
            const faviconUrl = `/api/logo/download/${logoData.favIcon}`;
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = faviconUrl;
            } else {
                const newFavicon = document.createElement('link');
                newFavicon.rel = 'icon';
                newFavicon.href = faviconUrl;
                document.head.appendChild(newFavicon);
            }
        }
        }, [logoData?.favIcon]);

    return (
        <>
            <header className={`w-full relative z-[70] ${isSticky ? 'sticky top-0 bg-white' : ''}`}>
                {/* Logo and Search Section */}
                <div className="max-w-[75rem] mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img 
                            src={logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : ""} 
                            alt="Company Logo" 
                            className="h-auto w-[100px] md:w-[130px] lg:w-[150px]"
                        />
                    </Link>
                    <div className="w-1/2 md:mt-0  hidden md:block">
                        <SearchBar />
                    </div>
                    {/* Mobile Search and Menu */}
                    <div className="flex items-center  md:hidden">
                        <div className="w-full">
                            <SearchBar />
                        </div>
                        <Button
                            variant="ghost"
                            className="text-[#2d4899] hover:text-orange-400 hover:bg-transparent p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="bg-[#2d4899] text-white">
                    <div className="max-w-[75rem] mx-auto px-4 flex items-center justify-evenly">
                        <div className="space-x-2 lg:space-x-3 hidden md:flex text-sm items-center lg:text-[16px] font-bold">
                            <div
                                className="relative"
                                onMouseEnter={() => setCorporateDropdownOpen(true)}
                                onMouseLeave={() => setCorporateDropdownOpen(false)}
                            >
                                <NavLink 
                                    href="/introduction" 
                                    className={() => isHomeActive ? "text-orange-400" : ""}
                                    end
                                >
                                    Corporate
                                </NavLink>
                                {corporateDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 w-64  bg-blue-800 text-white shadow-lg z-50 font-normal"
                                    >
                                        <Link
                                            to="/introduction"
                                            className="block px-4 py-2 hover:bg-blue-600 transition-colors"
                                        >
                                           <span>Introduction</span>
                                        </Link>
                                        <Link
                                            to="/vision-mission"
                                            className="block px-4 py-2 hover:bg-blue-600 transition-colors"
                                        >
                                            Vision
                                        </Link>
                                    </motion.div>
                                )}
                            </div>

                            {/* Products Dropdown */}
                            <NavLink
                                href="/categories"
                                hasDropdown={true}
                                categories={categories}
                                state={{ categoryName: "Products" }}
                                className={() => `font-bold  ${isProductsActive ? "text-orange-400" : ""}`}
                            >
                                Products
                            </NavLink>

                            {/* Static Links */}
                            <NavLink 
                                href="/worldwide"
                                className={({ isActive }) => isActive ? "text-orange-400" : ""}
                            >
                                Worldwide
                            </NavLink>
                            <NavLink 
                                href="/careers"
                                className={({ isActive }) => isActive ? "text-orange-400" : ""}
                            >
                                Careers
                            </NavLink>

                            {/* Blog Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setBlogDropdownOpen(true)}
                                onMouseLeave={() => setBlogDropdownOpen(false)}
                            >
                                <NavLink 
                                    href="/blogs"
                                    className={() => `block py-2 px-4 hover:text-orange-400 transition-colors ${isBlogActive ? "text-orange-400" : ""}`}
                                >
                                    Blog
                                </NavLink>
                                {blogDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 w-64 bg-blue-800 text-white shadow-lg z-50 font-normal"
                                    >
                                        {parsedBlogCategories.length > 0 ? (
                                            parsedBlogCategories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/blog/${category.slug}`}
                                                    className="block px-4 py-2 hover:bg-blue-600 transition-colors"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="px-4 py-2">No blog categories available</p>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Static Links */}
                            <NavLink 
                                href="/contact-us"
                                className={() => isContactActive ? "text-orange-400" : ""}
                            >
                                Contact Us
                            </NavLink>
                        {/* User Actions */}
                        {!mobileMenuOpen && (
                            <div className="hidden md:flex justify-center items-center">
                                <Button 
                                    variant="ghost" 
                                    className="text-white bg-orange-500 rounded-none px-4 lg:px-7 py-6 lg:py-8 hover:bg-orange-500 hover:text-white text-sm lg:text-[16px] font-bold"
                                    onClick={() => navigate('/advance-search')}
                                >
                                    Advanced Search
                                </Button>
                            </div>
                        )}
                        </div>

                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 z-[75]"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden fixed top-0 left-0 right-0 h-screen bg-[#2d4899] w-full px-4 py-2 space-y-2 z-[80] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between pb-4 bg-white -mx-4 px-4 pt-2">
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                                        <img 
                                            src={logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : ""} 
                                            alt="Company Logo" 
                                            className="h-auto w-[150px]"
                                        />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="text-[#2d4899] hover:text-orange-400 hover:bg-transparent p-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>
                                <Link 
                                    to="/"
                                    className={`block py-2 text-white hover:text-orange-400 ${isHomeActive ? "text-orange-400" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link 
                                    to="/corporate"
                                    className="block py-2 text-white hover:text-orange-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Corporate
                                </Link>
                                <Link 
                                    to="/categories"
                                    className="block py-2 text-white hover:text-orange-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Products
                                </Link>
                                <Link 
                                    to="/worldwide"
                                    className="block py-2 text-white hover:text-orange-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Worldwide
                                </Link>
                                <Link 
                                    to="/careers"
                                    className="block py-2 text-white hover:text-orange-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Careers
                                </Link>
                                <Link 
                                    to="/events"
                                    className="block py-2 text-white hover:text-orange-400"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Events
                                </Link>
                                <Link 
                                    to="/contact-us"
                                    className={`block py-2 text-white hover:text-orange-400 ${isContactActive ? "text-orange-400" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact Us
                                </Link>
                                <Button 
                                    variant="ghost" 
                                    className="w-full text-white bg-orange-500 rounded-none py-4 hover:bg-orange-500 hover:text-white text-sm"
                                    onClick={() => {
                                        navigate('/advance-search');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Advanced Search
                                </Button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className=" w-full mb-10 mx-auto ">
                <Outlet />
            </main>
            <Footer/>
        </>
    );
}


