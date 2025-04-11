"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner"

import SkeletonLoader from "./SkeletonLoader"
import SlideshowImages from "./SlideShowImages"
import SlideshowControls from "./SlideShowControlles"
import ReadMoreButton from "./ReadMoreButton"
import { preloadResources } from "./PreLoad"

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
  const [deviceType, setDeviceType] = useState("desktop") // Default to desktop
  const lcpImageRef = useRef(null)
  const slideshowRef = useRef(null)

  // Determine device type based on screen width
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    // Check on initial load
    checkDeviceType();

    // Add event listener for resize
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  // Helper function to get the appropriate image based on device type
  const getDeviceSpecificImage = (banner) => {
    if (!banner) return null;

    // Assuming your banner object has device-specific image fields
    switch (deviceType) {
      case "mobile":
        return banner.mobileImage || banner.image; // Fallback to default if mobileImage doesn't exist
      case "tablet":
        return banner.tabletImage || banner.image; // Fallback to default if tabletImage doesn't exist
      default:
        return banner.image; // Desktop or fallback
    }
  };

  // Load Delay Optimization
  useEffect(() => {
    if (Array.isArray(banners) && banners.length > 0) {
      const lcpBanner = banners[0];
      if (lcpBanner) {
        const imageId = getDeviceSpecificImage(lcpBanner);
        const imagePath = `/api/image/download/${imageId}`;
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          setLcpImageLoaded(true);
          setImagesLoaded((prev) => ({ ...prev, 0: true }));
        };
      }
    }
  }, [banners, deviceType]); // Added deviceType dependency

  // Preload next image
  useEffect(() => {
    if (!lcpImageLoaded) return;

    // Delay loading the next image by 500ms to prioritize the LCP image
    const timeoutId = setTimeout(() => {
      if (Array.isArray(banners) && banners.length > 1) {
        // Only preload the next image to avoid resource contention
        const nextBanner = banners[1];
        const imageId = getDeviceSpecificImage(nextBanner);
        
        const img = new Image();
        img.src = `/api/image/download/${imageId}`;
        img.fetchPriority = "low";
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, 1: true }));
        };
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [banners, lcpImageLoaded, deviceType]); // Added deviceType dependency

  // Slideshow interval
  useEffect(() => {
    if (!lcpImageLoaded) return;

    const imageCount = Array.isArray(banners) ? banners.length : 0;
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
  }, [banners, lcpImageLoaded]);

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
          if (entry.name.includes('/api/image/download/') && 
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

  if (isLoading || !Array.isArray(banners)) {
    return <SkeletonLoader />;
  }

  if (banners?.length === 0) return <div>No banners available</div>;

  // Modify the banner data to include device-specific images
  const deviceSpecificBanners = banners.map(banner => ({
    ...banner,
    dynamicImage: getDeviceSpecificImage(banner)
  }));

  return (
    <div className="relative" ref={slideshowRef}>
      {/* Skeleton shows until first image loads */}
      {!lcpImageLoaded && <SkeletonLoader />}

      <SlideshowImages 
        imageSource={deviceSpecificBanners}
        currentImageIndex={currentImageIndex}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
        lcpImageRef={lcpImageRef}
        deviceType={deviceType}
        lcpImageLoaded={lcpImageLoaded}
        setLcpImageLoaded={setLcpImageLoaded}
      />

      <ReadMoreButton lcpImageLoaded={lcpImageLoaded} />

      <SlideshowControls 
        imageSource={deviceSpecificBanners}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        lcpImageLoaded={lcpImageLoaded}
      />
    </div>
  );
};

export default Slideshow;