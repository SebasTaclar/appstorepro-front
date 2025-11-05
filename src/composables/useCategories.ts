import { ref, computed } from 'vue'
import { categoryService } from '@/services/api'
import type { Category, CreateCategoryRequest } from '@/types/CategoryType'

// Estado global de categorías (inicializado vacío, se cargará desde el backend)
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
  // Función para cargar todas las categorías con filtros opcionales
  const loadCategories = async (filters?: { name?: string; description?: string }) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 [loadCategories] Iniciando carga de categorías...')
      const response = await categoryService.getCategories(filters)
      console.log('📥 [loadCategories] Respuesta del backend:', response)

      if (response.success) {
        // La respuesta puede venir en dos formatos:
        // 1. { data: [...] } - Array directo
        // 2. { data: { categories: [...], count: N } } - Objeto con categories
        const raw = response.data as unknown
        console.log('📦 [loadCategories] Datos raw:', raw)

        let categoriesToNormalize: unknown[] = []

        if (Array.isArray(raw)) {
          // Formato 1: Array directo
          categoriesToNormalize = raw
        } else if (raw && typeof raw === 'object' && 'categories' in raw) {
          // Formato 2: Objeto con propiedad categories
          const dataObj = raw as { categories?: unknown[] }
          if (Array.isArray(dataObj.categories)) {
            categoriesToNormalize = dataObj.categories
          }
        }

        const normalized = categoriesToNormalize.map(normalizeCategory)
        console.log('✅ [loadCategories] Categorías normalizadas:', normalized)
        categories.value = normalized
        console.log('📋 [loadCategories] Categories.value actualizado:', categories.value.length, categories.value)

        return { success: true, data: response.data }
      } else {
        error.value = response.message
        console.error('❌ [loadCategories] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar categorías'
      error.value = errorMessage
      console.error('❌ [loadCategories] Excepción:', err)
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
      console.log('📝 [useCategories] Creando categoría:', categoryData)
      console.log('📋 [useCategories] Categorías antes de crear:', categories.value.length)

      const response = await categoryService.createCategory(categoryData)
      console.log('📥 [useCategories] Respuesta del backend:', response)

      if (response.success) {
        const normalized = normalizeCategory(response.data)
        console.log('✅ [useCategories] Categoría normalizada:', normalized)

        categories.value.push(normalized)
        console.log('📋 [useCategories] Categorías después de crear:', categories.value.length)
        console.log('📋 [useCategories] Array completo:', categories.value)

        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        console.error('❌ [useCategories] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría'
      error.value = errorMessage
      console.error('❌ [useCategories] Excepción:', err)
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
    // Estado - Retornar refs directamente para mantener reactividad
    categories,
    loading,
    error,

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
