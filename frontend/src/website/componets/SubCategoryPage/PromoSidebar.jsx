import img3 from "../../../assets/category_crousal/3.png";
import img1 from "../../../assets/category_crousal/1.png";
import img4 from "../../../assets/category_crousal/4.png";
import img5 from "../../../assets/category_crousal/5.png";
import img2 from "../../../assets/category_crousal/2.png";
import { useEffect, useState } from "react";

export default function PromoSidebar() {
    const images = [img1, img2, img3, img4, img5];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    console.log("Current Image Index:", currentImageIndex);
    const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
}, [currentImageIndex, images.length]);

    return (
        <div className="w-62 relative h-[55vh] overflow-hidden">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Promo ${index + 1}`}
                    className={`w-full h-full absolute object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}
        </div>
    );
}
