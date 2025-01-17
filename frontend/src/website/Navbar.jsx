import { useGetAllChemicalCategoriesQuery } from '@/slice/chemicalSlice/chemicalCategory'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCircle, LogIn, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import image from "./images/logo.png";
import NavbarComp from './componets/navbar/Navbar';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: categories } = useGetAllChemicalCategoriesQuery();
  console.log(categories)
  return (
    <header className="w-full">
    <NavbarComp  categories={ categories }/>
    </header>
  );
}; 


export default Navbar;
 