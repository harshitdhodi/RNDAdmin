import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function NavigationMenu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get("/api/navigationLink/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching navigation links:", error);
      });
  }, []);

  return (
    <nav className="w-full bg-gray-400/20">
      <div className="border-x-2 border-gray-700/10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 md:divide-y-0 divide-gray-700/10">
          {menuItems.map((item, index) => (
            <Link
              key={item._id}
              to={item.href}
              className={`md:flex flex-col block gap-4 items-center justify-center hover:bg-blue-900 transition-colors hover:text-white group lg:px-4 py-3 lg:py-6 ${index % 2 === 1 ? 'border-t-2 md:border-t-0' : ''}`}
            >
              <div className="text-orange-500 group-hover:scale-110 transition-transform">
                <img src={`/api/logo/download/${item.icon}`} alt={item.name} className="sm:w-10 w-5 object-fit sm:h-10 sm:object-fill" />
              </div>
              <span className="text-center sm:text-[18px] text-[12px] font-bold">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}