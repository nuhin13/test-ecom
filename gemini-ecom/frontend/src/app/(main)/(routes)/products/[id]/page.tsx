import Image from 'next/image'
import api from '@/lib/api'
import { IProduct } from '@/types'
import ProductDetailClient from '@/components/products/ProductDetailClient'

async function getProduct(id: string): Promise<IProduct | null> {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product: IProduct | null = await getProduct(params.id)

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          {/* Image gallery */}
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={600}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            {product.images[1] && (
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <Image
                  src={product.images[1]}
                  alt={product.name}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
            {product.images[2] && (
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <Image
                  src={product.images[2]}
                  alt={product.name}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
          </div>
          {/* Video preview could go here */}
        </div>

        <ProductDetailClient product={product} />
      </div>
    </div>
  )
}
