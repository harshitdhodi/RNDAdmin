import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCircle, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavLink } from "./NavLink";
import image from "../../images/logo.png";
import { useGetAllCategoriesQuery } from "@/slice/blog/blogCategory";
import SearchBar from "./SearchBar";
import Footer from "../home/Footer";

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

    return (
        <>
            <header className={`w-full ${isSticky ? 'sticky top-0 z-50 shadow-lg bg-white' : ''}`}>

                {/* Logo and Search Section */}
                <div className="max-w-7xl mr-16 mx-auto   py-4 md:flex items-center justify-evenly">
                    <Link to="/" className="flex items-center -ml-6 gap-2">
                        <img src={image} alt="Central Drug House Logo" className="lg:h-[56px] lg:w-[450px] w-[100px]  h-auto " />
                    </Link>
                    <SearchBar />
                </div>

                {/* Navigation Section */}
                <nav className="bg-[#2d4899] text-white">
                    <div className="container mx-auto flex items-center justify-center">
                         <div className="space-x-3 hidden  text-[16px] font-bold md:flex">
                           
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
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            className="text-white hover:text-orange-400 hover:bg-transparent p-2 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>

                        {/* User Actions */}
                        {!mobileMenuOpen && (
                            <div className="flex justify-center items-center">
                                <Button 
                                    variant="ghost" 
                                    className="text-white bg-orange-500 rounded-none px-7 py-8 hidden hover:bg-orange-500 hover:text-white text-[16px] font-bold sm:flex items-center justify-center"
                                    onClick={() => navigate('/advance-search')}
                                >
                                    Advanced Search
                                </Button>
                                {/* <div className="h-6 w-px bg-white/20" /> */}
                                {/* <Button variant="ghost" className="text-white flex items-center gap-2">
                                    <UserCircle className="h-5 w-5" />
                                    <p className="hidden md:block">Register</p>
                                </Button>
                                <Button variant="ghost" className="text-white flex items-center gap-2">
                                    <LogIn className="h-5 w-5" />
                                    <p className="hidden md:block">Login</p>
                                </Button> */}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-[#2d4899] px-4 py-2 space-y-2"
                        >
                            <NavLink 
                                href="/"
                                className={() => isHomeActive ? "text-orange-400" : ""}
                                end
                            >
                                Home
                            </NavLink>
                            <NavLink href="/corporate">Corporate</NavLink>
                            <NavLink href="/categories">Products</NavLink>
                            <NavLink href="/worldwide">Worldwide</NavLink>
                            <NavLink href="/careers">Careers</NavLink>
                            <NavLink href="/events">Events</NavLink>
                            <NavLink 
                                href="/contact-us"
                                className={() => isContactActive ? "text-orange-400" : ""}
                            >
                                Contact Us
                            </NavLink>
                            <Button 
                                variant="ghost" 
                                className="text-white bg-orange-500 rounded-none p-7 hover:bg-orange-500 hover:text-white"
                                onClick={() => navigate('/advance-search')}
                            >
                                Advanced Search
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className="w-full mb-10 mx-auto">
                <Outlet />
            </main>
            <Footer/>
        </>

    );
}


