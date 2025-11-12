import ProductCard from '@/components/products/ProductCard'
import api from '@/lib/api'
import { IProduct } from '@/types'

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
    try {
        const { data } = await api.get('/products', { params: searchParams });
        return data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { products: [], pages: 0, count: 0 };
    }
}

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { products, pages, count } = await getProducts(searchParams);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Products</h1>
        <p className="mt-4 text-base text-gray-500">
          Showing {products.length} of {count} results.
        </p>

        <div className="pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
          <aside>
            <h2 className="sr-only">Filters</h2>
            {/* Filter component would go here */}
            <div className="hidden lg:block">
                <form className="space-y-10 divide-y divide-gray-200">
                    {/* Price, category, rating filters */}
                </form>
            </div>
          </aside>

          <div className="mt-6 lg:col-span-3 lg:mt-0">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product: IProduct) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
        {/* Pagination controls would go here */}
      </div>
    </div>
  )
}
