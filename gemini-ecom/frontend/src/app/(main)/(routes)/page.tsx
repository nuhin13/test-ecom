import Image from 'next/image'
import HeroSlider from '@/components/home/HeroSlider'
import React from 'react'

// Mock Data - in a real app, this would come from an API
const topRatedProducts = [
  { id: 1, name: 'Product A', price: 100, image: 'https://via.placeholder.com/300', rating: 4.8 },
  { id: 2, name: 'Product B', price: 120, image: 'https://via.placeholder.com/300', rating: 4.7 },
  { id: 3, name: 'Product C', price: 80, image: 'https://via.placeholder.com/300', rating: 4.9 },
  { id: 4, name: 'Product D', price: 150, image: 'https://via.placeholder.com/300', rating: 4.8 },
]

const categories = [
    { name: 'Electronics', image: 'https://via.placeholder.com/300' },
    { name: 'Apparel', image: 'https://via.placeholder.com/300' },
    { name: 'Home Goods', image: 'https://via.placeholder.com/300' },
    { name: 'Jute Crafts', image: 'https://via.placeholder.com/300' },
    { name: 'Leather', image: 'https://via.placeholder.com/300' },
    { name: 'Ceramics', image: 'https://via.placeholder.com/300' },
]

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section aria-labelledby="categories-heading" className="mb-16">
          <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 xl:gap-x-8">
            {categories.map((category) => (
              <div key={category.name} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <Image src={category.image} alt={category.name} width={300} height={200} className="h-full w-full object-cover object-center group-hover:opacity-75" />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Products */}
        <section aria-labelledby="top-rated-heading">
          <h2 id="top-rated-heading" className="text-2xl font-bold tracking-tight text-gray-900">Top Rated Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {/* In a real app, you'd map over ProductCard components */}
            {topRatedProducts.map(p => <div key={p.id} className="group relative"><div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"><Image src={p.image} alt={p.name} width={300} height={400} className="h-full w-full object-cover object-center lg:h-full lg:w-full"/></div><div className="mt-4 flex justify-between"><h3 className="text-sm text-gray-700">{p.name}</h3><p className="text-sm font-medium text-gray-900">${p.price}</p></div></div>)}
          </div>
        </section>
      </div>
    </div>
  )
}
