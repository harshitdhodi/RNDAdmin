import React, { useEffect } from "react";

const SlideshowImages = ({
  imageSource,
  currentImageIndex,
  hoveredIndex,
  setHoveredIndex,
  lcpImageRef,
  isSmallDevice,
  lcpImageLoaded,
  setLcpImageLoaded,
}) => {
  // Standardize image source construction
  const getImageSrc = (image) => `/api/image/download/${image}`;

  // Preload only the LCP image and the next image in the queue
  useEffect(() => {
    if (!imageSource || !Array.isArray(imageSource)) return;

    const preloadImage = (src, priority = "high") => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;
      link.as = "image";
      link.fetchPriority = priority;
      document.head.appendChild(link);
    };

    // Preload the first image (LCP) with high priority
    preloadImage(getImageSrc(imageSource[0].image), "high");

    // Preload the next image with low priority
    const nextIndex = (currentImageIndex + 1) % imageSource.length;
    if (imageSource[nextIndex]) {
      preloadImage(getImageSrc(imageSource[nextIndex].image), "low");
    }
  }, [imageSource, currentImageIndex]);

  if (!imageSource || !Array.isArray(imageSource)) return null;

  return (
    <div
      className="relative w-full h-[35vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden"
      style={{
        contain: "layout size",
        containIntrinsicSize: "1200px 800px",
        aspectRatio: "1200 / 800", // Prevent layout shift
      }}
    >
      {imageSource.map((item, index) => {
        const isVisible = index === currentImageIndex;
        const isNextInQueue = index === (currentImageIndex + 1) % imageSource.length;

        // Skip rendering images that aren’t visible or next in queue (except the LCP image)
        if (!isVisible && !isNextInQueue && index > 0) return null;

        return (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              willChange: isVisible || isNextInQueue ? "opacity" : "auto",
              contain: isVisible || isNextInQueue ? "none" : "strict",
            }}
          >
            <img
              ref={index === 0 ? lcpImageRef : null}
              src={getImageSrc(item.image)} // Consistent image source for all devices
              alt={item.altName || `Slide ${index + 1}`}
              className={`sm:w-full h-[250px] w-[800px] sm:h-full object-cover ${
                index === 0 && !lcpImageLoaded ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
              title={hoveredIndex === index ? item.title : ""}
              fetchPriority={index === 0 ? "high" : "low"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              width={1200}
              height={800}
              importance={index === 0 ? "high" : "auto"}
              onLoad={() => {
                if (index === 0) {
                  setLcpImageLoaded(true);
                  if (window.performance && window.performance.now) {
                    const loadTime = window.performance.now();
                    console.log(`First image loaded in ${loadTime}ms`);
                  }
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SlideshowImages;