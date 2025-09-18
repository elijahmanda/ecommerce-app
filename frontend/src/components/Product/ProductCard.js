import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="h-48 relative overflow-hidden">
          <Image
            src={product.images[0]?.url || '/images/placeholder.jpg'}
            alt={product.images[0]?.altText || product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
          {product.ratingsAverage > 0 && (
            <div className="mt-2 flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-600">
                {product.ratingsAverage.toFixed(1)} ({product.ratingsQuantity})
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}