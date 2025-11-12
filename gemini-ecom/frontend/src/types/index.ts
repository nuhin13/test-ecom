// This file defines the core data structures for the frontend application.

export interface IProduct {
  _id: string
  name: string
  description: string
  price: number
  discountedPrice?: number
  category: {
    _id: string
    name: string
    slug: string
  }
  stock: number
  images: string[]
  video?: string
  specs: Record<string, string>
  ratings: {
    average: number
    count: number
  }
  deliveryEstimateDays: number
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface ICategory {
  _id: string
  name: string
  slug: string
  image: string
}

export interface IOrder {
  _id: string
  user: string // User ID
  items: {
    product: string // Product ID
    name: string
    quantity: number
    price: number
    image: string
  }[]
  totalAmount: number
  shippingAddress: {
    street: string
    city: string
    zip: string
    country: string
  }
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface IReview {
  _id: string
  user: {
    _id: string
    name: string
  }
  product: string // Product ID
  rating: number
  comment: string
  createdAt: string
}
