import ProductCard from '@/components/Product/ProductCard'

async function getFeaturedProducts() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?featured=true`, {
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    return []
  }
  
  return res.json()
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-8 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-xl mb-6">Discover amazing products at great prices</p>
            <a href="#products" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </a>
          </div>
        </section>

        {/* Featured Products */}
        <section id="products">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}