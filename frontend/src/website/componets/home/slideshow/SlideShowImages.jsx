import React from "react";

const SlideshowImages = ({
  imageSource,
  currentImageIndex,
  hoveredIndex,
  setHoveredIndex,
  lcpImageRef,
  isSmallDevice,
  lcpImageLoaded,
  setLcpImageLoaded
}) => {
  return (
    <div
      className="relative w-full h-[35vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden"
      style={{
        contain: "layout size",
        containIntrinsicSize: "1200px 800px",
        aspectRatio: "1200 / 800", // Reserve space to prevent layout shift
      }}
    >
      {imageSource && imageSource.map((item, index) => {
        const isVisible = index === currentImageIndex;
        const isNextInQueue = isSmallDevice
          ? index === (currentImageIndex + 1) % 2
          : index === (currentImageIndex + 1) % imageSource.length;

        if (!isVisible && !isNextInQueue && index > 0) return null;

        return (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              willChange: isVisible || isNextInQueue ? "opacity" : "auto",
              contain: isVisible || isNextInQueue ? "none" : "strict",
            }}
          >
            <img
              ref={index === 0 ? lcpImageRef : null}
              src={isSmallDevice ? item.image : `/api/image/download/${item.image}`}
              alt={item.altName || `Slide ${index + 1}`}
              className={`w-full h-full object-cover ${index === 0 && !lcpImageLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
              title={hoveredIndex === index ? item.title : ""}
              fetchPriority={index === 0 ? "high" : "low"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              width={1200}
              height={800}
              importance={index === 0 ? "high" : "low"}
              sizes="100vw"
              onLoad={() => {
                if (index === 0) {
                  setLcpImageLoaded(true);
                  if (window.performance && window.performance.now) {
                    const loadTime = window.performance.now();
                    console.log(`First image loaded in ${loadTime}ms`);
                  }
                }
              }}
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SlideshowImages;