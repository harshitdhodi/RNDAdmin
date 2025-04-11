import React from "react";

const SlideshowImages = ({ 
  imageSource, 
  currentImageIndex, 
  hoveredIndex, 
  setHoveredIndex, 
  lcpImageRef, 
  deviceType, 
  lcpImageLoaded, 
  setLcpImageLoaded 
}) => {
  return (
    <div className="relative w-full h-[300px] sm:h-[500px] md:h-[600px] overflow-hidden">
      {imageSource.map((banner, index) => {
        const imageId = banner.dynamicImage || banner.image;
        const isVisible = index === currentImageIndex || index === hoveredIndex;

        // Assuming you have different resolutions of the image saved on the server
        const srcBase = `/api/image/download/${imageId}`;
        const srcSet = `
          ${srcBase}?w=480 480w,
          ${srcBase}?w=768 768w,
          ${srcBase}?w=1024 1024w,
          ${srcBase}?w=1280 1280w,
          ${srcBase}?w=1600 1600w
        `;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={`${srcBase}?w=768`} // fallback/default src
              srcSet={srcSet}
              sizes="(max-width: 640px) 100vw,
                     (max-width: 1024px) 100vw,
                     100vw"
              alt={banner.title || "Slideshow image"}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              ref={index === 0 ? lcpImageRef : null}
              onLoad={() => {
                if (index === 0 && !lcpImageLoaded) {
                  setLcpImageLoaded(true);
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
