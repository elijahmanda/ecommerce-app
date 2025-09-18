import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticate, isAdmin } from '@/lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort')
    const featured = searchParams.get('featured')

    const where = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (featured === 'true') {
      where.featured = true
    }

    let orderBy = {}
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' }
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' }
    } else if (sort === 'popular') {
      orderBy = { reviews: { _count: 'desc' } }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    // calculate average rating for each product
    const productsWithAvgRating = products.map(product => {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
      const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
      
      return {
        ...product,
        ratingsAverage: avgRating,
        ratingsQuantity: product.reviews.length
      }
    })

    return NextResponse.json(productsWithAvgRating)

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticate(request)
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status }
      )
    }

    if (!isAdmin(authResult.user)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        images: body.images,
        stock: parseInt(body.stock),
        category: body.category,
        brand: body.brand,
        featured: body.featured === 'true'
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}