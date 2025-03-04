import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useGetBannerByPageSlugQuery } from '@/slice/banner/banner';
import { Link, useParams } from 'react-router-dom';

const Slideshow = () => {
  const { pageSlug } = useParams();
  const slug = pageSlug || '/';
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(slug);
  console.log(banners)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!Array.isArray(banners)) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  if (isLoading) return <div>Loading...</div>;

  if (!Array.isArray(banners) || banners.length === 0) return <div>No banners available</div>;

  return (
    <>
      <div className="relative w-full h-[40vh] sm:h-[70vh] overflow-hidden">
        {banners.map((banner, index) => (
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
      <div className='absolute w-full top-[22%] sm:top-[65%] lg:top-[75%] md:top-[75%] pl-[15%] mt-10'>
        <Link to="/introduction">
          <Button className="bg-orange-500 sm:flex  hidden hover:bg-orange-600 sm:font-bold sm:px-5 px-3">
            <span>Read More </span><span><ArrowRight className='w-5 h-5 sm:w-10 sm:h-10' /> </span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Slideshow;