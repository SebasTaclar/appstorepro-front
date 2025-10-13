// Tipo de producto interno del frontend
export type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string // categoryId como string para consistencia interna
  status: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean // Nueva propiedad del modelo Prisma
  showcaseImage?: string // Nueva propiedad del modelo Prisma
  createdAt: Date
  updatedAt?: Date
}

// Request para crear producto (lo que enviamos al backend)
export interface CreateProductRequest {
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: number // Backend espera number
  status?: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean
  showcaseImage?: string
}

// Request para actualizar producto (todos los campos opcionales)
export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  originalPrice?: number
  images?: string[]
  categoryId?: number
  status?: 'available' | 'out-of-stock' | 'coming-soon'
  colors?: string[]
  isShowcase?: boolean
  showcaseImage?: string
}

// Response del backend al crear/obtener un producto
export interface CreateProductResponse {
  id: number
  name: string
  description: string
  price: number // Backend puede devolver string si es Decimal
  originalPrice?: number
  images: string // JSON string del backend
  categoryId: number
  status: string
  colors?: string // JSON string del backend
  isShowcase: boolean
  showcaseImage?: string
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

// Tipo para la respuesta de getProducts que puede venir en dos formatos:
// 1. Array directo: Product[]
// 2. Objeto con metadata: { count: number, products: Product[] }
export type GetProductsResponse =
  | Array<CreateProductResponse>
  | { count: number; products: Array<CreateProductResponse> }
