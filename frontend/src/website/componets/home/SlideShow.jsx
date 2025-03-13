"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner"
import { Link, useParams } from "react-router-dom"

// Enhanced skeleton with better alignment to final content
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
  const slideshowRef = useRef(null)

  // 1. TTFB Optimization - Add preconnect for API domain immediately 
  useEffect(() => {
    // Use crossorigin attribute for CORS requests
    const preconnectLink = document.createElement("link")
    preconnectLink.rel = "preconnect"
    preconnectLink.href = new URL("/api", window.location.href).origin
    preconnectLink.crossOrigin = "anonymous" // Add crossorigin for CORS resources
    document.head.appendChild(preconnectLink)

    // Add DNS prefetch as fallback for browsers that don't support preconnect
    const dnsPrefetchLink = document.createElement("link")
    dnsPrefetchLink.rel = "dns-prefetch"
    dnsPrefetchLink.href = new URL("/api", window.location.href).origin
    document.head.appendChild(dnsPrefetchLink)

    return () => {
      document.head.removeChild(preconnectLink)
      document.head.removeChild(dnsPrefetchLink)
    }
  }, [])

  // 2. Load Delay Optimization - Preload LCP image with critical priority
  useEffect(() => {
    if (!Array.isArray(banners) || banners.length === 0) return

    const lcpImage = banners[0]
    if (lcpImage) {
      const imagePath = `/api/image/download/${lcpImage.image}`

      // Use both preload link with highest priority
      const preloadLink = document.createElement("link")
      preloadLink.rel = "preload"
      preloadLink.as = "image"
      preloadLink.href = imagePath
      preloadLink.fetchPriority = "high"
      preloadLink.importance = "high" // Additional hint for some browsers
      document.head.appendChild(preloadLink)

      // Also use Image constructor for the first image with high priority
      const img = new Image()
      img.src = imagePath
      img.fetchPriority = "high"
      img.onload = () => {
        setLcpImageLoaded(true)
        setImagesLoaded((prev) => ({ ...prev, 0: true }))

        // Report to analytics or performance monitoring
        if (window.performance && window.performance.now) {
          console.log(`LCP image loaded in ${window.performance.now()}ms`)
        }
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

  // Only preload next 2 images after LCP is loaded to reduce contention
  useEffect(() => {
    if (!Array.isArray(banners) || banners.length <= 1 || !lcpImageLoaded) return

    // Preload only next 2 images with low priority to avoid resource contention
    banners.slice(1, 3).forEach((banner, index) => {
      const actualIndex = index + 1
      const img = new Image()
      img.src = `/api/image/download/${banner.image}`
      img.fetchPriority = "low"
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [actualIndex]: true }))
      }
    })
  }, [banners, lcpImageLoaded])

  // 3. Load Time Optimization - Use appropriate image format and consider responsive images
  // Slideshow interval - only start after LCP image is loaded and with requestAnimationFrame
  useEffect(() => {
    if (!Array.isArray(banners) || !lcpImageLoaded) return

    let animationFrameId
    let lastTimestamp = 0
    const intervalDuration = 3000

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp

      if (timestamp - lastTimestamp >= intervalDuration) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length)
        lastTimestamp = timestamp
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [banners, lcpImageLoaded])

  // 4. Render Delay Optimization - Using content-visibility and will-change
  useEffect(() => {
    // Use IntersectionObserver to detect when slideshow is in viewport
    if (slideshowRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Prioritize rendering when in viewport
              entry.target.style.contentVisibility = 'visible'
            } else {
              // Deprioritize when off-screen
              entry.target.style.contentVisibility = 'auto'
            }
          })
        },
        { rootMargin: '200px 0px' }
      )

      observer.observe(slideshowRef.current)

      return () => {
        if (slideshowRef.current) {
          observer.unobserve(slideshowRef.current)
        }
      }
    }
  }, [])

  // 5. LCP Measurement with more detailed analytics
  useEffect(() => {
    if (typeof PerformanceObserver !== "undefined") {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]

        // Get more detailed LCP information
        console.log("LCP:", lastEntry.startTime,
          "Element:", lastEntry.element,
          "Size:", lastEntry.size,
          "ID:", lastEntry.id,
          "URL:", lastEntry.url)

        // Could send to analytics here
      })

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

      // Resource timing for image loading performance
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          if (entry.name.includes('/api/image/download/') && entry.initiatorType === 'img') {
            console.log('Image timing:', {
              name: entry.name,
              duration: entry.duration,
              transferSize: entry.transferSize,
              encodedBodySize: entry.encodedBodySize,
              decodedBodySize: entry.decodedBodySize
            })
          }
        })
      })

      resourceObserver.observe({ type: "resource", buffered: true })

      return () => {
        lcpObserver.disconnect()
        resourceObserver.disconnect()
      }
    }
  }, [])

  // Immediately show skeleton with content-visibility: auto to optimize paint
  if (isLoading || !Array.isArray(banners)) {
    return <SkeletonLoader />
  }

  if (banners.length === 0) return <div>No banners available</div>

  // 6. Early optimization: prepare first banner's URL and inline critical CSS
  const firstBannerSrc = banners[0] ? `/api/image/download/${banners[0].image}` : ''

  return (
    <div className="relative" ref={slideshowRef}>
      {/* Skeleton shows until first image loads */}
      {!lcpImageLoaded && <SkeletonLoader />}

      <div
        className={`relative w-full h-[35vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden ${!lcpImageLoaded ? "hidden" : ""}`}
        style={{
          contain: 'layout size',
          containIntrinsicSize: '1200px 800px'
        }}
      >
        {banners.map((banner, index) => {
          // Only render visible image and next image to save resources
          const isVisible = index === currentImageIndex
          const isNextInQueue = index === (currentImageIndex + 1) % banners.length
          if (!isVisible && !isNextInQueue && index > 0) return null

          return (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                willChange: isVisible || isNextInQueue ? 'opacity' : 'auto',
                // Use contain property for better paint performance
                contain: isVisible || isNextInQueue ? 'none' : 'strict'
              }}
            >
              {/* Optimized image element with modern loading attributes */}
              <img
                ref={index === 0 ? lcpImageRef : null}
                src={`/api/image/download/${banner.image}`}
                alt={banner.altName || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                title={hoveredIndex === index ? banner.title : ""}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "lazy" : "eager"}
                decoding={index === 0 ? "sync" : "async"}
                width="3"
                height="2"
                // Add importance attribute for prioritization
                importance={index === 0 ? "high" : "low"}
                // Add sizes attribute to help browser determine resource priority
                sizes="100vw"
                onLoad={() => {
                  if (index === 0) {
                    setLcpImageLoaded(true)
                    // Mark the time when the LCP element finishes loading
                    if (window.performance && window.performance.now) {
                      const loadTime = window.performance.now()
                      console.log(`First image loaded in ${loadTime}ms`)
                      // Could send to analytics
                    }
                  }
                }}
                style={{
                  // Optimize image rendering with GPU acceleration
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
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

      {/* Pagination dots - optimized for less repaints */}
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 ${!lcpImageLoaded ? "hidden" : ""}`}
        style={{ contain: 'layout style' }}
      >
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentImageIndex ? "bg-orange-500" : "bg-gray-300"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow