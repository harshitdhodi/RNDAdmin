import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "./SearchBar";
import Footer from "../home/Footer";
import { useGetLogoQuery } from "@/slice/logo/LogoSlice";
import NavSection from "./NavSection";

export default function NavbarComp({ categories }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const { data: logoData, isLoading: isLogoLoading } = useGetLogoQuery();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className={`w-full relative z-[70] ${isSticky ? "sticky top-0 bg-white shadow-md" : ""}`}>
                <div className="max-w-[75rem] mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        {isLogoLoading ? (
                            <Skeleton className="h-10 w-[150px]" />
                        ) : (
                            <img
                                src={logoData?.headerLogo ? `/api/logo/download/${logoData.headerLogo}` : ""}
                                alt="Company Logo"
                                title={logoData?.headerLogoName}
                                loading="lazy"
                                className="h-auto w-[100px] md:w-[130px] lg:w-[150px]"
                            />
                        )}
                    </Link>
                    <div className="w-1/2 hidden md:block">
                        <SearchBar isLoading={isLogoLoading} />
                    </div>
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            className="text-[#2d4899] hover:text-orange-400 hover:bg-transparent p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
                <NavSection categories={categories} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            </header>
            <main className="w-full mb-10 mx-auto">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
