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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-gray-700/10">
          {menuItems.map((item) => (
            <Link
              key={item._id}
              to={item.href}
              className="lg:flex block gap-4 items-center justify-center hover:bg-blue-900 transition-colors hover:text-white group px-4 py-6"
            >
              <div className="text-orange-500 group-hover:scale-110 transition-transform">
                <img src={`/api/logo/download/${item.icon}`} alt={item.name} className="w-10 h-10 object-fill" />
              </div>
              <span className="text-center text-md font-bold">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}