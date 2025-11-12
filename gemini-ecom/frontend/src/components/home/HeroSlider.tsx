'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const banners = [
  { id: 1, src: '/assets/banners/banner1.jpg', alt: 'Banner 1' },
  { id: 2, src: '/assets/banners/banner2.jpg', alt: 'Banner 2' },
  { id: 3, src: '/assets/banners/banner3.jpg', alt: 'Banner 3' },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-64 w-full overflow-hidden md:h-96">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-white text-4xl font-bold">Your Sourcing Partner</h2>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HeroSlider
