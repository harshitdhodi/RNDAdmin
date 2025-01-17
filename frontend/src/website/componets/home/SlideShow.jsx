import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useGetAllBannersQuery } from '@/slice/banner/banner';
import { Link } from 'react-router-dom';

const Slideshow = () => {
  const { data: banners, isLoading } = useGetAllBannersQuery();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!banners) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="relative w-full h-[60vh] overflow-hidden">
        {banners?.map((banner, index) => (
          <div
            key={banner._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={`/api/image/download/${banner.image}`}
              alt={banner.altName}
              className="w-full h-full object-cover"
              title={hoveredIndex === index ? banner.title : ''}
            />
          </div>
        ))}
      </div>
      <div className='absolute top-[65%] pl-[15%] mt-10'>
        <Link to="/introduction">
          <Button className="bg-orange-500 hover:bg-orange-600 font-bold px-5">
            Read More <ArrowRight className='w-10 h-10' /> 
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Slideshow;

