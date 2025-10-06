import { ref, computed, watch } from 'vue'

// Claves para localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'applestore_products',
  CATEGORIES: 'applestore_categories',
  SHOWCASE_PRODUCTS: 'applestore_showcase_products'
}

// Funciones de utilidad para localStorage
const saveToStorage = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error guardando en localStorage:', error)
  }
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convertir fechas de string a Date objects
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
        })) as T
      }
      return parsed
    }
  } catch (error) {
    console.error('Error cargando de localStorage:', error)
  }
  return defaultValue
}

// Tipos para productos
export interface Product {
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
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: Date
}

// Interface para productos de novedades (ProductShowcase)
export interface ShowcaseProduct {
  id: string
  name: string
  description: string
  image: string
  category: string
  createdAt: Date
}

// Datos por defecto
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'El iPhone más avanzado con chip A17 Pro, sistema de cámaras Pro y diseño de titanio',
    price: 4299000,
    originalPrice: 4599000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895395658',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895395625'
    ],
    category: '1',
    status: 'available',
    colors: ['Titanio Natural', 'Titanio Azul', 'Titanio Blanco', 'Titanio Negro'],
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'iPad Air 11"',
    description: 'iPad Air con chip M2, pantalla Liquid Retina de 11 pulgadas y compatible con Apple Pencil Pro',
    price: 2199000,
    originalPrice: 2399000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-finish-select-gallery-202405-11inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1713920820026',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-finish-select-gallery-202405-11inch-purple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1713920820059'
    ],
    category: '2',
    status: 'available',
    colors: ['Azul', 'Púrpura', 'Blanco Estrella', 'Rosa'],
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'AirPods Pro (2.ª generación)',
    description: 'Cancelación activa de ruido, modo de sonido ambiental y audio espacial personalizado',
    price: 949000,
    originalPrice: 1099000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660803972361',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-202209?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1660012491833'
    ],
    category: '3',
    status: 'available',
    colors: ['Blanco'],
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'MacBook Pro 14"',
    description: 'Potente laptop con chip M3 Pro, pantalla Liquid Retina XDR y hasta 18 horas de batería',
    price: 8499000,
    originalPrice: 8999000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1697311054290',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-silver-select-202310?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1697311054387'
    ],
    category: '4',
    status: 'available',
    colors: ['Gris Espacial', 'Plata'],
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'iPhone 15',
    description: 'iPhone 15 con cámara de 48 MP, conector USB-C y Dynamic Island',
    price: 3299000,
    originalPrice: 0,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895781054',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692895781080'
    ],
    category: '1',
    status: 'available',
    colors: ['Rosa', 'Azul', 'Verde', 'Amarillo', 'Negro'],
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    description: 'Reloj inteligente con chip S9, pantalla más brillante y nuevos gestos con el dedo',
    price: 1499000,
    originalPrice: 1699000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-45-aluminum-pink-nc-s9_VW_PF+watch-face-45-aluminum-pink-s9_VW_PF?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693248280535',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9_VW_PF+watch-face-45-aluminum-midnight-s9_VW_PF?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693248280566'
    ],
    category: '3',
    status: 'coming-soon',
    colors: ['Rosa', 'Medianoche', 'Luz Estelar', 'Rojo (PRODUCT)RED'],
    createdAt: new Date()
  },
  {
    id: '7',
    name: 'iPad Pro 12.9"',
    description: 'iPad Pro con chip M2, pantalla Liquid Retina XDR de 12.9 pulgadas y soporte para Apple Pencil',
    price: 4299000,
    originalPrice: 0,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1664411207213',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-silver-202210?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1664411207090'
    ],
    category: '2',
    status: 'coming-soon',
    colors: ['Gris Espacial', 'Plata'],
    createdAt: new Date()
  },
  {
    id: '8',
    name: 'AirPods Max',
    description: 'Audífonos premium con cancelación activa de ruido, audio espacial y hasta 20 horas de reproducción',
    price: 2199000,
    originalPrice: 2399000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-spacegray-202011?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1603996647635',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-pink-202011?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1603996647635'
    ],
    category: '3',
    status: 'available',
    colors: ['Gris Espacial', 'Plata', 'Rosa', 'Verde', 'Azul Cielo'],
    createdAt: new Date()
  },
  {
    id: '9',
    name: 'MacBook Air 15"',
    description: 'Laptop ultraligera con chip M2, pantalla Liquid Retina de 15.3 pulgadas y hasta 18 horas de batería',
    price: 5499000,
    originalPrice: 0,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1684518479433',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-starlight-select-202306?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1684518479705'
    ],
    category: '4',
    status: 'available',
    colors: ['Medianoche', 'Luz Estelar', 'Plata', 'Gris Espacial'],
    createdAt: new Date()
  },
  {
    id: '10',
    name: 'Mac Studio',
    description: 'Potente computadora de escritorio con chip M2 Max o M2 Ultra para profesionales creativos',
    price: 7999000,
    originalPrice: 8499000,
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-studio-select-202306?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1684345161143'
    ],
    category: '4',
    status: 'coming-soon',
    colors: ['Plata'],
    createdAt: new Date()
  }
]

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'iPhone',
    description: 'Smartphones iPhone con la última tecnología Apple',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'iPad',
    description: 'Tablets iPad para creatividad, productividad y entretenimiento',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Accesorios',
    description: 'AirPods, Apple Watch y otros accesorios Apple',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Mac',
    description: 'MacBooks, Mac Studio y computadoras Apple',
    createdAt: new Date()
  }
]

const defaultShowcaseProducts: ShowcaseProduct[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Titanio, chip A17 Pro y fotografía de siguiente nivel en un diseño ultraligero.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=1200&hei=1200&fmt=jpeg&qlt=90&.v=1692895395658',
    category: '1',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Apple Watch Ultra 2',
    description: 'Diseñado para aventura, deporte y salud con GPS de precisión y gran autonomía.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-hero-select-202309?wid=1200&hei=1200&fmt=jpeg&qlt=90&.v=1693361190559',
    category: '3',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'MacBook Pro 16"',
    description: 'Potencia y rendimiento excepcional con chip M3 Max y pantalla Liquid Retina XDR.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=1200&hei=1200&fmt=jpeg&qlt=90&.v=1697311054435',
    category: '4',
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'iPad Pro 11"',
    description: 'Creatividad sin límites con chip M2 y Apple Pencil de segunda generación.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-wifi-spacegray-202210?wid=1200&hei=1200&fmt=jpeg&qlt=90&.v=1664411207306',
    category: '2',
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'AirPods Pro (2.ª generación)',
    description: 'Audio inmersivo con cancelación de ruido activa y audio espacial personalizado.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1200&hei=1200&fmt=jpeg&qlt=90&.v=1660803972361',
    category: '3',
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Mac Studio',
    description: 'Potencia de escritorio extrema con chips M2 Max y M2 Ultra para flujos de trabajo profesionales.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-studio-select-202306?wid=1200&hei=1200&fmt=jpeg&qlt=90&.v=1684345161143',
    category: '4',
    createdAt: new Date()
  }
]

// Estado global de productos - carga desde localStorage o usa datos por defecto
const products = ref<Product[]>(loadFromStorage(STORAGE_KEYS.PRODUCTS, defaultProducts))
const categories = ref<Category[]>(loadFromStorage(STORAGE_KEYS.CATEGORIES, defaultCategories))
const showcaseProducts = ref<ShowcaseProduct[]>(loadFromStorage(STORAGE_KEYS.SHOWCASE_PRODUCTS, defaultShowcaseProducts))

// Cache simple para nombres de categorías (evita iteraciones repetidas en filtros y mapeos)
const categoryNameCache = new Map<string, string>()
const getCategoryNameCached = (id: string): string | undefined => {
  if (categoryNameCache.has(id)) return categoryNameCache.get(id)
  const cat = categories.value.find(c => c.id === id)
  if (cat) categoryNameCache.set(id, cat.name)
  return cat?.name
}

// Utilidad debounce para reducir frecuencia de escritura en localStorage
function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay = 400) {
  let t: number | undefined
  return (...args: Args) => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), delay)
  }
}

export function useProducts() {
  // Computed para productos disponibles (para ProductStore) - incluye available y coming-soon
  const availableProducts = computed(() =>
    products.value.filter(p => p.status === 'available' || p.status === 'coming-soon')
  )

  // Funciones para gestionar productos
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    products.value.push(newProduct)
    return newProduct
  }

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...productData }
      return products.value[index]
    }
    return null
  }

  const deleteProduct = (id: string) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
      return true
    }
    return false
  }

  const getProductById = (id: string) => {
    return products.value.find(p => p.id === id)
  }

  const getProductsByCategory = (categoryId: string) => {
    return products.value.filter(p => p.category === categoryId)
  }

  // Funciones para gestionar categorías
  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    categories.value.push(newCategory)
    return newCategory
  }

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...categoryData }
      return categories.value[index]
    }
    return null
  }

  const deleteCategory = (id: string) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      return true
    }
    return false
  }

  const getCategoryById = (id: string) => {
    return categories.value.find(c => c.id === id)
  }

  // Funciones para gestionar showcase products
  const addShowcaseProduct = (productData: Omit<ShowcaseProduct, 'id' | 'createdAt'>) => {
    const newProduct: ShowcaseProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    showcaseProducts.value.push(newProduct)
    return newProduct
  }

  const updateShowcaseProduct = (id: string, productData: Partial<ShowcaseProduct>) => {
    const index = showcaseProducts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      showcaseProducts.value[index] = { ...showcaseProducts.value[index], ...productData }
      return showcaseProducts.value[index]
    }
    return null
  }

  const deleteShowcaseProduct = (id: string) => {
    const index = showcaseProducts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      showcaseProducts.value.splice(index, 1)
      return true
    }
    return false
  }

  // Watchers para guardar automáticamente en localStorage
  const persistProducts = debounce((newProducts: Product[]) => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, newProducts)
  })
  const persistCategories = debounce((newCategories: Category[]) => {
    // Limpiar cache si cambia lista de categorías
    categoryNameCache.clear()
    saveToStorage(STORAGE_KEYS.CATEGORIES, newCategories)
  })
  const persistShowcase = debounce((newShowcaseProducts: ShowcaseProduct[]) => {
    saveToStorage(STORAGE_KEYS.SHOWCASE_PRODUCTS, newShowcaseProducts)
  })

  watch(products, persistProducts, { deep: true })
  watch(categories, persistCategories, { deep: true })
  watch(showcaseProducts, persistShowcase, { deep: true })

  return {
    // State
    products,
    categories,
    showcaseProducts,
    availableProducts,

    // Product methods
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,

    // Category methods
    addCategory,
    updateCategory,
    deleteCategory,
  getCategoryById,
  getCategoryNameCached,

    // Showcase product methods
    addShowcaseProduct,
    updateShowcaseProduct,
    deleteShowcaseProduct
  }
}
