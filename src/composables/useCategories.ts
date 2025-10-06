import { ref, computed } from 'vue'
import { categoryService } from '@/services/api'
import type { Category, CreateCategoryRequest } from '@/types/CategoryType'

// Estado global de categorías
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Normaliza cualquier forma entrante de categoría (id numérico o string, fechas string) al tipo Category
function normalizeCategory(input: unknown): Category {
  if (typeof input === 'object' && input !== null) {
    const anyCat = input as Record<string, unknown>
    const id = anyCat.id !== undefined ? String(anyCat.id) : crypto.randomUUID()
    const name = String(anyCat.name || '')
    const description = String(anyCat.description || '')
    const createdAtRaw = anyCat.createdAt
    const updatedAtRaw = anyCat.updatedAt
    return {
      id,
      name,
      description,
      createdAt: createdAtRaw ? new Date(String(createdAtRaw)) : new Date(),
      updatedAt: updatedAtRaw ? new Date(String(updatedAtRaw)) : undefined
    }
  }
  // Fallback vacío controlado
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    createdAt: new Date()
  }
}

export function useCategories() {
  // Función para cargar todas las categorías
  const loadCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.getCategories()

      if (response.success) {
        // response.data puede venir en dos formatos: Category[] (id string) o arreglo con id numérico
        const raw = response.data as unknown
        if (Array.isArray(raw)) {
          categories.value = raw.map(normalizeCategory)
        } else {
          categories.value = []
        }
        return { success: true, data: response.data }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar categorías'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para crear una nueva categoría
  const createCategory = async (categoryData: CreateCategoryRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.createCategory(categoryData)

      if (response.success) {
        const normalized = normalizeCategory(response.data)
        categories.value.push(normalized)
        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para actualizar una categoría
  const updateCategory = async (id: number, categoryData: Partial<CreateCategoryRequest>) => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.updateCategory(id, categoryData)

      if (response.success) {
        const normalized = normalizeCategory(response.data)
        const index = categories.value.findIndex((cat) => cat.id === String(id))
        if (index !== -1) categories.value[index] = normalized
        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar categoría'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para eliminar una categoría
  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await categoryService.deleteCategory(id)

      if (response.success) {
        categories.value = categories.value.filter((cat) => cat.id !== String(id))
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar categoría'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para obtener una categoría por ID
  const getCategoryById = (id: number | string): Category | undefined => {
    return categories.value.find((cat) => cat.id === String(id))
  }

  // Función para limpiar errores
  const clearError = () => {
    error.value = null
  }

  // Función para refrescar categorías
  const refreshCategories = async () => {
    return await loadCategories()
  }

  return {
    // Estado
    categories: computed(() => categories.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Computeds
    categoriesCount: computed(() => categories.value.length),
    hasCategories: computed(() => categories.value.length > 0),

    // Funciones
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    clearError,
    refreshCategories,
  }
}
