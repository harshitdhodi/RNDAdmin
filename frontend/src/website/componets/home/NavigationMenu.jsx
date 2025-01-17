import { FileText, Files, FolderOpen, Package, Microscope, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavigationMenu() {
  const menuItems = [
    {
      title: "Quality Assurance",
      icon: <FileText className="w-8 h-8" />,
      href: "/quality-assurance",
    },
    {
      title: "MSDS/COA'S",
      icon: <Files className="w-8 h-8" />,
      href: "/msds-coa",
    },
    {
      title: "Catalogs & Price Lists",
      icon: <FolderOpen className="w-8 h-8" />,
      href: "/catalogs",
    },
    {
      title: "Packings",
      icon: <Package className="w-8 h-8" />,
      href: "/packings",
    },
    {
      title: "R&D & GMP",
      icon: <Microscope className="w-8 h-8" />,
      href: "/rd-gmp",
    },
    {
      title: "Contact Us",
      icon: <Phone className="w-8 h-8" />,
      href: "/contact",
    },
  ];

  return (
    <nav className="w-full bg-gray-400/20">
      <div className="border-x-2 border-gray-700/10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-gray-700/10">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="lg:flex block gap-1 items-center justify-center hover:bg-blue-900 transition-colors group px-4 py-6"
            >
              <div className="text-orange-500 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-center text-md font-bold">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
