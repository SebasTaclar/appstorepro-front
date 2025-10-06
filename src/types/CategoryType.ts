// Tipos para categorías
export interface Category {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt?: Date
}

export interface CreateCategoryRequest {
  name: string
  description: string
}

export interface CreateCategoryResponse {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type GetCategoriesResponse = Array<Category>
