import Image from 'next/image'
import Link from 'next/link'
import { IProduct } from '@/types'

interface ProductCardProps {
  product: IProduct
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          width={300}
          height={400}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <div className="mt-1 flex items-baseline">
        {product.discountedPrice ? (
          <>
            <p className="text-lg font-medium text-gray-900">${product.discountedPrice}</p>
            <p className="ml-2 text-sm text-gray-500 line-through">${product.price}</p>
          </>
        ) : (
          <p className="text-lg font-medium text-gray-900">${product.price}</p>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-500">Delivers in {product.deliveryEstimateDays} days</p>
      {/* Rating stars would go here */}
    </Link>
  )
}

export default ProductCard
