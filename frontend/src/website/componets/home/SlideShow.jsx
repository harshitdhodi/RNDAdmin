'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useGetBannerByPageSlugQuery } from '@/slice/banner/banner';
import { Link, useParams } from 'react-router-dom';
import m1 from '../../images/slide1.webp';
import m2 from '../../images/slide1.webp';

// Skeleton loader with fixed dimensions
const SkeletonLoader = () => (
  <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded overflow-hidden">
    <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%]">
      <div className="w-32 h-10 bg-gray-300 animate-pulse rounded" />
    </div>
  </div>
);

// Static images for small devices
const staticImages = [
  { _id: 'static-1', image: m1, title: 'Image 1', altName: 'Static Image 1' },
  { _id: 'static-2', image: m2, title: 'Image 2', altName: 'Static Image 2' }
];

const Slideshow = () => {
  const { pageSlug } = useParams();
  const slug = pageSlug || '/';
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(slug);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Start with 0
  const [isSmallDevice, setIsSmallDevice] = useState(typeof window !== 'undefined' && window.innerWidth < 640);
  const slideshowRef = useRef(null);

  // Device size and LCP image loading
  useEffect(() => {
    const handleResize = () => setIsSmallDevice(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slideshow animation (no initial delay)
  useEffect(() => {
    let animationFrameId;
    let lastTimestamp = 0;
    const intervalDuration = 3000;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      if (timestamp - lastTimestamp >= intervalDuration) {
        setCurrentImageIndex((prev) => (prev + 1) % (isSmallDevice ? 2 : banners?.length || 1));
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSmallDevice, banners]);

  if (isLoading && !isSmallDevice) return <SkeletonLoader />;
  if (!isSmallDevice && banners?.length === 0) return <div>No banners available</div>;

  const imageSource = isSmallDevice ? staticImages : banners || [];

  return (
    <div className="relative" ref={slideshowRef}>
    <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden">
      {imageSource.map((item, index) => {
        const isVisible = index === currentImageIndex;
        const isNext = index === (currentImageIndex + 1) % imageSource.length;
        if (!isVisible && !isNext && index > 0) return null;
  
        return (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={isSmallDevice ? item.image : `/api/image/download/${item.image}`}
              alt={item.altName || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
              fetchPriority={index === 0 ? 'high' : 'low'}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding={index === 0 ? 'sync' : 'async'}
            />
          </div>
        );
      })}
    </div>
  
    <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%]">
      <Link to="/introduction">
        <Button className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm md:text-base font-medium sm:font-bold px-3 py-1 sm:px-4 sm:py-2 md:px-5 relative -bottom-52 md:py-2 sm:flex items-center sm:mb-16 hidden gap-1 sm:gap-2">
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </Button>
      </Link>
    </div>
  
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" style={{ contain: 'layout style' }}>
      {imageSource.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
            index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  </div>
  
  );
};

export default Slideshow;