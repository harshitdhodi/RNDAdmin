// File: src/components/Slideshow/index.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner"

import SkeletonLoader from "./SkeletonLoader"
import SlideshowImages from "./SlideShowImages"
import SlideshowControls from "./SlideShowControlles"
import ReadMoreButton from "./ReadMoreButton"
import { preloadResources } from "./PreLoad"
import { staticImages } from "./StaticImg"

// Initialize immediate preloading before React hydrates
if (typeof window !== 'undefined') {
  preloadResources();
}

const Slideshow = () => {
  const { pageSlug } = useParams()
  const slug = pageSlug || "/"
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(slug)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState({})
  const [lcpImageLoaded, setLcpImageLoaded] = useState(false)
  const [isSmallDevice, setIsSmallDevice] = useState(false)
  const lcpImageRef = useRef(null)
  const slideshowRef = useRef(null)

  // Check if device is small (based on screen width)
  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 640);
    };

    // Check on initial load
    checkDeviceSize();

    // Add event listener for resize
    window.addEventListener('resize', checkDeviceSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);

  // Load Delay Optimization
  useEffect(() => {
    if (isSmallDevice) {
      setLcpImageLoaded(true);
      setImagesLoaded((prev) => ({ ...prev, 0: true }));
    } else if (Array.isArray(banners) && banners.length > 0) {
      const lcpImage = banners[0];
      if (lcpImage) {
        const imagePath = `/api/image/download/${lcpImage.image}`;
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          setLcpImageLoaded(true);
          setImagesLoaded((prev) => ({ ...prev, 0: true }));
        };
      }
    }
  }, [banners, isSmallDevice]);

  // Preload next image
  useEffect(() => {
    if (!lcpImageLoaded) return;

    // Delay loading the next image by 500ms to prioritize the LCP image
    const timeoutId = setTimeout(() => {
      if (isSmallDevice) {
        const img = new Image();
        img.src = staticImages[1].image;
        img.fetchPriority = "low";
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, 1: true }));
        };
      } else if (Array.isArray(banners) && banners.length > 1) {
        // Only preload the next image to avoid resource contention
        const img = new Image();
        img.src = `/api/image/download/${banners[1].image}`;
        img.fetchPriority = "low";
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, 1: true }));
        };
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [banners, lcpImageLoaded, isSmallDevice]);

  // Slideshow interval
  useEffect(() => {
    if (!lcpImageLoaded) return;

    const imageCount = isSmallDevice ? 2 : (Array.isArray(banners) ? banners.length : 0);
    if (!imageCount) return;

    let animationFrameId;
    let lastTimestamp = 0;
    const intervalDuration = 3000;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      if (timestamp - lastTimestamp >= intervalDuration) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
        lastTimestamp = timestamp;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [banners, lcpImageLoaded, isSmallDevice]);

  // Render Delay Optimization
  useEffect(() => {
    if (slideshowRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.contentVisibility = 'visible';
            } else {
              entry.target.style.contentVisibility = 'auto';
            }
          });
        },
        { rootMargin: '200px 0px' }
      );

      observer.observe(slideshowRef.current);

      return () => {
        if (slideshowRef.current) {
          observer.unobserve(slideshowRef.current);
        }
      };
    }
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (typeof PerformanceObserver !== "undefined") {
      // Performance monitoring code (unchanged)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime,
          "Element:", lastEntry.element,
          "Size:", lastEntry.size,
          "ID:", lastEntry.id,
          "URL:", lastEntry.url);
      });

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if ((entry.name.includes('/api/image/download/') ||
            entry.name.includes('m1.jpg') ||
            entry.name.includes('m2.jpg')) &&
            entry.initiatorType === 'img') {
            console.log('Image timing:', {
              name: entry.name,
              duration: entry.duration,
              transferSize: entry.transferSize,
              encodedBodySize: entry.encodedBodySize,
              decodedBodySize: entry.decodedBodySize
            });
          }
        });
      });

      resourceObserver.observe({ type: "resource", buffered: true });

      return () => {
        lcpObserver.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, []);

  if ((isLoading || !Array.isArray(banners)) && !isSmallDevice) {
    return <SkeletonLoader />;
  }

  if (!isSmallDevice && banners?.length === 0) return <div>No banners available</div>;

  const imageSource = isSmallDevice ? staticImages : banners;

  return (
    <div className="relative" ref={slideshowRef}>
      {/* Skeleton shows until first image loads */}
      {!lcpImageLoaded && <SkeletonLoader />}

      <SlideshowImages 
        imageSource={imageSource}
        currentImageIndex={currentImageIndex}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        lcpImageRef={lcpImageRef}
        isSmallDevice={isSmallDevice}
        lcpImageLoaded={lcpImageLoaded}
        setLcpImageLoaded={setLcpImageLoaded}
      />

      <ReadMoreButton lcpImageLoaded={lcpImageLoaded} />

      <SlideshowControls 
        imageSource={imageSource}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        lcpImageLoaded={lcpImageLoaded}
      />
    </div>
  );
};

export default Slideshow;