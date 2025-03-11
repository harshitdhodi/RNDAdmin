"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner"
import { Link, useParams } from "react-router-dom"

const SkeletonLoader = () => (
  <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-200 animate-pulse rounded overflow-hidden">
    <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%]">
      <div className="w-32 h-10 bg-gray-300 animate-pulse rounded" />
    </div>
  </div>
)

const Slideshow = () => {
  const { pageSlug } = useParams()
  const slug = pageSlug || "/"
  const { data: banners, isLoading } = useGetBannerByPageSlugQuery(slug)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [imagesLoaded, setImagesLoaded] = useState({})
  const [lcpImageLoaded, setLcpImageLoaded] = useState(false)
  const lcpImageRef = useRef(null)

  // Preload LCP image using priority hints and preconnect
  useEffect(() => {
    // Add preconnect for the API domain
    const preconnectLink = document.createElement("link")
    preconnectLink.rel = "preconnect"
    preconnectLink.href = new URL("/api", window.location.href).origin
    document.head.appendChild(preconnectLink)
    
    return () => {
      document.head.removeChild(preconnectLink)
    }
  }, [])

  // Preload LCP image as soon as data is available
  useEffect(() => {
    if (!Array.isArray(banners) || banners.length === 0) return

    // Create a preload for the first image with high priority
    const lcpImage = banners[0]
    if (lcpImage) {
      const imagePath = `/api/image/download/${lcpImage.image}`
      
      // Use both preload link and Image constructor for best browser support
      const preloadLink = document.createElement("link")
      preloadLink.rel = "preload"
      preloadLink.as = "image"
      preloadLink.href = imagePath
      preloadLink.fetchPriority = "high" // Set high priority for the preload
      document.head.appendChild(preloadLink)

      // Also use the Image constructor for the first image
      const img = new Image()
      img.src = imagePath
      img.fetchPriority = "high"
      img.onload = () => {
        setLcpImageLoaded(true)
        setImagesLoaded((prev) => ({ ...prev, 0: true }))
      }
      img.onerror = () => {
        setLcpImageLoaded(true)
        setImagesLoaded((prev) => ({ ...prev, 0: true }))
      }
      
      return () => {
        document.head.removeChild(preloadLink)
      }
    }
  }, [banners])

  // Preload remaining images after LCP image
  useEffect(() => {
    if (!Array.isArray(banners) || banners.length <= 1 || !lcpImageLoaded) return

    // Preload remaining images after the first one is loaded, with lower priority
    banners.slice(1).forEach((banner, index) => {
      const actualIndex = index + 1 // Adjust index since we're skipping the first image
      const img = new Image()
      img.src = `/api/image/download/${banner.image}`
      img.fetchPriority = "low"
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [actualIndex]: true }))
      }
      img.onerror = () => {
        setImagesLoaded((prev) => ({ ...prev, [actualIndex]: true }))
      }
    })
  }, [banners, lcpImageLoaded])

  // Slideshow interval - only start after LCP image is loaded
  useEffect(() => {
    if (!Array.isArray(banners) || !lcpImageLoaded) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [banners, lcpImageLoaded])

  // Add LCP measurement callback using the Performance Observer API
  useEffect(() => {
    if (typeof PerformanceObserver !== "undefined") {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log("LCP:", lastEntry.startTime, "Element:", lastEntry.element)
      })

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

      return () => {
        lcpObserver.disconnect()
      }
    }
  }, [])

  // Consider showing early content even before LCP image is fully loaded
  if (isLoading || !Array.isArray(banners)) {
    return <SkeletonLoader />
  }

  if (banners.length === 0) return <div>No banners available</div>

  // Early optimization: prepare first banner's URL to avoid calculation during render
  const firstBannerSrc = banners[0] ? `/api/image/download/${banners[0].image}` : ''

  return (
    <div className="relative">
      {!lcpImageLoaded && <SkeletonLoader />}

      <div
        className={`relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden ${!lcpImageLoaded ? "hidden" : ""}`}
      >
        {banners.map((banner, index) => {
          // Only render visible images or soon-to-be-visible images to save resources
          const isVisible = index === currentImageIndex
          const isNextInQueue = index === (currentImageIndex + 1) % banners.length
          if (!isVisible && !isNextInQueue && index > 0) return null

          return (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ willChange: isVisible || isNextInQueue ? 'opacity' : 'auto' }}
            >
              {/* Optimized image element with modern loading attributes */}
              <img
                ref={index === 0 ? lcpImageRef : null}
                src={`/api/image/download/${banner.image}`}
                alt={banner.altName || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                title={hoveredIndex === index ? banner.title : ""}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
                // Provide dimensions to help browser calculate aspect ratio before load
                width="1200"
                height="800"
                onLoad={() => {
                  if (index === 0) {
                    setLcpImageLoaded(true)
                    // Report LCP loading time to analytics if needed
                    if (window.performance && window.performance.now) {
                      console.log(`First image loaded in ${window.performance.now()}ms`)
                    }
                  }
                }}
              />
            </div>
          )
        })}
      </div>

      <div
        className={`absolute w-full top-1/2 transform -translate-y-1/2 px-4 sm:px-[15%] ${!lcpImageLoaded ? "hidden" : ""}`}
      >
        <Link to="/introduction">
          <Button className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm md:text-base font-medium sm:font-bold px-3 py-1 sm:px-4 sm:py-2 md:px-5 relative -bottom-52 md:py-2 sm:flex items-center sm:mb-16 hidden gap-1 sm:gap-2">
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Button>
        </Link>
      </div>

      {/* Pagination dots */}
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 ${!lcpImageLoaded ? "hidden" : ""}`}
      >
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentImageIndex ? "bg-orange-500" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow