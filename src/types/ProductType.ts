export type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  status: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  createdAt: Date
  updatedAt?: Date
}
