// Tipos para categorías
export interface Category {
  id: string
  name: string
  description?: string // Opcional según modelo Prisma
  createdAt: Date
  updatedAt?: Date
}

export interface CreateCategoryRequest {
  name: string
  description?: string // Opcional según modelo Prisma
}

export interface CreateCategoryResponse {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

// Tipo para la respuesta de getCategories que puede venir en dos formatos:
// 1. Array directo: Category[]
// 2. Objeto con metadata: { count: number, categories: Category[] }
export type GetCategoriesResponse =
  | Array<Category>
  | { count: number; categories: Array<CreateCategoryResponse> }
