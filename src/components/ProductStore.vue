<template>
  <section class="product-store">
    <div class="container">
      <!-- Header de la sección -->
      <div class="store-header">
        <h2 class="store-title">
          Nuestra Tienda
        </h2>
        <p class="store-subtitle">
          Descubre nuestros productos Apple originales con garantía oficial
        </p>
      </div>

      <!-- Barra de búsqueda mejorada -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
          </svg>

          <input
            type="search"
            v-model="searchTerm"
            placeholder="Buscar por Nombre del Producto..."
            aria-label="Buscar productos por título"
            class="search-input"
          />

          <button v-if="searchTerm" class="search-clear" @click.prevent="searchTerm = ''" aria-label="Limpiar búsqueda">X</button>
        </div>
      </div>

      <!-- Filtros de categoría -->
      <div class="category-filters">
        <button
          v-for="category in categoryOptions"
          :key="category"
          @click="selectedCategory = category"
          :class="['filter-btn', { 'active': selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Grid de productos -->
      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="openProductModal(product)"
        >
          <!-- Categoría encima de la imagen -->
          <span class="product-category-top">{{ product.category }}</span>

          <!-- Imagen del producto -->
          <div class="product-image">
            <img :src="product.images[0]" :alt="product.name" loading="lazy" decoding="async" />
            <div v-if="product.originalPrice" class="discount-badge">
              -{{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%
            </div>
            <div v-if="!product.inStock" class="out-of-stock-overlay">
              <span>Agotado</span>
            </div>
            <!-- Estado del producto en esquina inferior izquierda -->
            <span :class="['product-status-image', getStatusClass(product.status)]">
              {{ getStatusText(product.status) }}
            </span>
          </div>

          <!-- Información del producto -->
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>

            <!-- Precios -->
            <div class="price-section">
              <span class="current-price">${{ product.price.toLocaleString() }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ${{ product.originalPrice.toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
      </div>      <!-- Botón del carrito flotante -->
      <div v-if="totalItems > 0" class="floating-cart" @click="toggleCart">
        <div class="cart-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m5 7 1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/>
            <path d="M22 7H2"/>
            <path d="m9 3 2-2 2 2"/>
          </svg>
          <span class="cart-badge">{{ totalItems }}</span>
        </div>
        <div class="cart-tooltip">Ver carrito de compras</div>
      </div>
    </div>

    <!-- Modal del carrito -->
    <div v-if="isCartOpen" class="cart-overlay" @click="closeCart">
      <div class="cart-modal" @click.stop>
        <div class="cart-header">
          <h3>Tu Carrito</h3>
          <button @click="closeCart" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div class="cart-content">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>

          <div v-else class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
            >
              <img :src="item.image" :alt="item.name" />
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <span class="item-category">{{ item.category }}</span>
                <span v-if="item.selectedColor" class="item-color">Color: {{ item.selectedColor }}</span>
                <div class="item-price">${{ item.price.toLocaleString() }}</div>
              </div>
              <div class="item-controls">
                <div class="quantity-controls">
                  <button @click="updateQuantity(item.id, item.quantity - 1, item.selectedColor)" class="quantity-btn minus">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, item.quantity + 1, item.selectedColor)" class="quantity-btn plus">+</button>
                </div>
                <button @click="removeFromCart(item.id, item.selectedColor)" class="remove-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-total-display">
            <strong>Total: ${{ totalPrice.toLocaleString() }}</strong>
          </div>
          <div class="cart-actions">
            <button @click="clearCart" class="btn-clear">
              Limpiar carrito
            </button>
            <button @click="goToCheckout" class="btn-checkout">
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal del producto -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close floating" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
        <div class="modal-body">
          <div class="modal-image">
            <div class="image-gallery">
              <img
                v-for="(image, index) in selectedProduct?.images"
                :key="index"
                :src="image"
                :alt="`${selectedProduct?.name} - ${index + 1}`"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div v-if="selectedProduct?.images && selectedProduct.images.length > 1" class="image-dots">
              <button
                v-for="(image, index) in selectedProduct.images"
                :key="index"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
              ></button>
            </div>
          </div>

          <div class="modal-info">
            <h2 class="modal-title">{{ selectedProduct?.name }}</h2>
            <div class="modal-category">
              {{ selectedProduct?.category }}
            </div>
            <p class="modal-description">
              {{ selectedProduct?.description }}
            </p>

            <div class="modal-price">
              <span class="modal-current-price">${{ selectedProduct?.price?.toLocaleString() }}</span>
              <span v-if="selectedProduct?.originalPrice" class="modal-original-price">${{ selectedProduct?.originalPrice?.toLocaleString() }}</span>
            </div>

            <div v-if="selectedProduct?.colors && selectedProduct.colors.length > 0" class="modal-colors">
              <h4>Seleccionar color:</h4>
              <div class="color-options">
                <div
                  v-for="colorName in selectedProduct.colors"
                  :key="colorName"
                  class="color-option"
                  :class="{ active: modalSelectedColor === colorName }"
                  @click="modalSelectedColor = colorName"
                >
                  <div
                    class="color-circle"
                    :style="{ backgroundColor: getColorHex(colorName), border: '2px solid ' + (modalSelectedColor === colorName ? '#26F7D7' : getColorHex(colorName)) }"
                  ></div>
                  <span class="color-name">{{ colorName }}</span>
                </div>
              </div>
            </div>

            <div class="modal-status">
              <span :class="['status-badge', getStatusClass(selectedProduct?.status || '')]">
                {{ getStatusText(selectedProduct?.status || '') }}
              </span>
            </div>

            <button
              @click="addToCartFromModal"
              :disabled="selectedProduct?.status !== 'available' || (selectedProduct?.colors && selectedProduct.colors.length > 0 && !modalSelectedColor)"
              class="modal-add-to-cart"
            >
              {{ selectedProduct?.status === 'available' ? 'Agregar al carrito' : 'No disponible' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.product-store {
  padding: 3rem 0;
  background: linear-gradient(135deg, #dad1d1 0%, #f3f0f0 100%);
  position: relative;
}
.product-store {
  padding: 3rem 0;
  background: linear-gradient(135deg, #dad1d1 0%, #f3f0f0 100%);
  position: relative;
}

/* Estilos del modal oscuro */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(0, 0, 0);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: #000000;
  width: 95%;
  max-width: 1100px;
  max-height: 85vh;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  display: flex;
  padding: 0;
  height: 100%;
  color: white;
}

.modal-main-content {
  display: flex;
  width: 100%;
}

.modal-image {
  flex: 1.2;
  background: linear-gradient(145deg, #1e1e1e 0%, #252525 100%);
  border-right: 1px solid #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.modal-details {
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-title {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.modal-category {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  margin: 0.5rem 0 1rem;
}

.modal-description {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.modal-price {
  font-size: 1.75rem;
  font-weight: 600;
  color: #0A84FF;
  margin: 1.5rem 0;
}

.modal-colors h4 {
  color: white;
  margin: 0 0 1rem;
  font-size: 0.875rem;
  font-weight: normal;
}

.color-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-option:hover {
  transform: scale(1.05);
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.2s ease;
}

.color-option.active .color-circle {
  border: 2px solid #26F7D7;
}

.color-name {
  font-size: 0.75rem;
  color: #fff;
  text-transform: uppercase;
}

.color-name {
  font-size: 0.85rem;
  color: #999;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
  background: transparent;
}

.status-available {
  color: #30D158;
  background: rgba(48, 209, 88, 0.1);
}

.modal-add-to-cart {
  margin-top: 2rem;
  width: 100%;
  padding: 0.875rem;
  background: #2C2C2E;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-add-to-cart:hover:not(:disabled) {
  background: #3A3A3C;
}

.modal-add-to-cart:disabled {
  background: #2C2C2E;
  opacity: 0.5;
  cursor: not-allowed;
}

/* Estilos para móvil */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  /* El contenedor del modal debe controlar el scroll en móvil */
  .modal-content {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 0;
    background: #000;
    overflow-y: auto; /* scroll para TODO el modal */
    -webkit-overflow-scrolling: touch;
  }

  /* Mostrar como grid (igual que AppleWatchPage) y dejar que el contenido fluya desde la parte superior
     La imagen formará parte del flujo y se desplazará junto al resto del contenido */
  .modal-body {
    display: grid;
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 24px;
    align-items: start;
  }

  .modal-close.floating {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(255,255,255,0.1);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    backdrop-filter: blur(6px);
  }

  .modal-close.floating svg {
    width: 20px;
    height: 20px;
  }

  .modal-image {
    width: calc(100% - 2rem);
    background: #fff;
    border-radius: 8px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem auto; /* centrar horizontalmente en móvil */
    box-shadow: 0 6px 20px rgba(0,0,0,0.5);
  }

  .modal-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  /* Asegurar que el contenido interno también esté centrado */
  .modal-image .image-gallery,
  .modal-image img {
    margin: auto;
  }

  .modal-info {
    padding: 0 1rem;
  }

  .modal-title {
    font-size: 2rem;
    line-height: 1.2;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .modal-category {
    color: #999;
    font-size: 0.875rem;
    margin: 0.25rem 0 1rem;
  }

  .modal-description {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
  }

  .modal-price {
    font-size: 2rem;
    color: #0A84FF;
    margin: 1.5rem 0;
  }

  .color-options {
    gap: 2rem;
    justify-content: flex-start;
    margin: 0.5rem 0 2rem;
  }

  .color-option {
    align-items: center;
  }

  .color-circle {
    width: 24px;
    height: 24px;
    border: 2px solid white;
  }

  .color-name {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    text-transform: uppercase;
  }

  .modal-status {
    margin: 1rem 0;
  }

  .modal-add-to-cart {
    margin: 1rem 0 2rem;
    width: 100%;
    background: #2C2C2E;
    border-radius: 8px;
    height: 48px;
    font-size: 0.9375rem;
  }
}
</style><script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useProducts, type Product as ProductType } from '@/composables/useProducts'

// Router
const router = useRouter()

// Usar el composable del carrito
const {
  cartItems,
  isCartOpen,
  totalItems,
  totalPrice,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart
} = useCart()

// Usar el composable de productos
const {
  availableProducts,
  categories,
  getCategoryById,
  loadProducts,
  loadCategories
} = useProducts()

// Cargar productos y categorías al montar el componente
onMounted(async () => {
  console.log('🏪 [ProductStore] onMounted - Iniciando carga...')
  console.log('🏪 [ProductStore] availableProducts ANTES de cargar:', availableProducts.value.length)

  await loadCategories()
  console.log('🏪 [ProductStore] Categorías cargadas:', categories.value.length)

  await loadProducts()
  console.log('🏪 [ProductStore] loadProducts ejecutado')
  console.log('🏪 [ProductStore] availableProducts DESPUÉS de cargar:', availableProducts.value.length)
  console.log('🏪 [ProductStore] availableProducts:', availableProducts.value)
})

// Watcher para debug: observar cambios en productos
watch(availableProducts, (newProducts) => {
  console.log('🔔 [ProductStore Watch] availableProducts cambiaron:', newProducts.length, newProducts)
}, { immediate: true })

// Estado local
const selectedCategory = ref('Todos')
// Término de búsqueda libre
const searchTerm = ref('')

// Estado para el modal
const showModal = ref(false)
const selectedProduct = ref<ProductType | null>(null)
const modalSelectedColor = ref('')
const selectedImageIndex = ref(0)

// Productos y categorías desde el composable
const products = computed(() => availableProducts.value)

// Computada para mapear el producto con inStock e image (para compatibilidad con useCart)
const mappedSelectedProduct = computed(() => {
  if (!selectedProduct.value) return null
  return {
    ...selectedProduct.value,
    inStock: selectedProduct.value.status === 'available',
    image: selectedProduct.value.images[0] // Usar la primera imagen para el carrito
  }
})

// Función para abrir modal del producto
const openProductModal = (product: ProductType) => {
  selectedProduct.value = product
  modalSelectedColor.value = ''
  selectedImageIndex.value = 0
  showModal.value = true
}

// Función para cerrar modal
const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
  modalSelectedColor.value = ''
}

// Función para ir al checkout
const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}

// Función para agregar al carrito desde el modal
const addToCartFromModal = () => {
  if (selectedProduct.value) {
    if (selectedProduct.value.colors && selectedProduct.value.colors.length > 0 && !modalSelectedColor.value) {
      // Si el producto tiene colores pero no se ha seleccionado uno, no hacer nada
      return
    }
    // Pasar el color seleccionado como tercer parámetro
    addToCart(mappedSelectedProduct.value!, 1, modalSelectedColor.value || undefined)
    closeModal()
  }
}

// Función para obtener el texto del estado del producto
const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'coming-soon':
      return 'Próximamente'
    case 'out-of-stock':
      return 'Agotado'
    default:
      return 'No disponible'
  }
}

// Función para obtener la clase CSS del estado
const getStatusClass = (status: string) => {
  switch (status) {
    case 'available':
      return 'status-available'
    case 'coming-soon':
      return 'status-coming-soon'
    case 'out-of-stock':
      return 'status-out-of-stock'
    default:
      return 'status-unavailable'
  }
}

// Categorías disponibles para filtrado
const categoryOptions = computed(() => {
  const categoryNames = ['Todos']
  categories.value.forEach(cat => {
    const categoryName = cat.name
    if (!categoryNames.includes(categoryName)) {
      categoryNames.push(categoryName)
    }
  })
  return categoryNames
})

// Productos filtrados
const filteredProducts = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  const mapAndEnhance = (list: ProductType[]) => list
    .map((p: ProductType) => ({
      ...p,
      category: getCategoryById(p.category)?.name || 'Sin categoría',
      inStock: p.status === 'available'
    }))
    .sort((a: ProductType, b: ProductType) => {
      // Primero los disponibles (available), luego los próximamente (coming-soon)
      if (a.status === 'available' && b.status !== 'available') return -1
      if (a.status !== 'available' && b.status === 'available') return 1
      return 0
    })

  let baseList = []
  if (selectedCategory.value === 'Todos') {
    baseList = products.value.filter(p => p.status === 'available' || p.status === 'coming-soon')
  } else {
    baseList = products.value.filter(p => getCategoryById(p.category)?.name === selectedCategory.value && (p.status === 'available' || p.status === 'coming-soon'))
  }

  // Si hay término de búsqueda, filtrar SÓLO por el nombre (título)
  if (term) {
    baseList = baseList.filter(p => {
      const name = String(p.name || '').toLowerCase()
      return name.includes(term)
    })
  }

  return mapAndEnhance(baseList)
})

// Colores de Apple predeterminados (incluye variantes en inglés y español)
const appleColors: Record<string, string> = {
  // Nueva paleta actualizada
  'naranja cósmico': '#ff5e00',
  'naranja cosmico': '#ff5e00',
  'azul profundo': '#003d5c',
  'plata': '#c0c0c0',
  'silver': '#c0c0c0',
  'azul': '#1976d2',
  'blue': '#1976d2',
  'negro': '#000000',
  'black': '#000000',
  'blanco': '#ffffff',
  'white': '#ffffff',
  'azul neblina': '#a8c7dd',
  'dorado claro': '#f7e7a1',
  'azul cielo': '#87ceeb',
  'rosa': '#ff69b4',
  'pink': '#ff69b4',
  'amarillo': '#ffeb3b',
  'yellow': '#ffeb3b',
  'verde': '#4caf50',
  'green': '#4caf50',
  'púrpura': '#9c27b0',
  'purpura': '#9c27b0',
  'purple': '#9c27b0',
  'morado': '#9c27b0',
  'oro': '#ffd700',
  'gold': '#ffd700'
}

// Normaliza nombres y obtiene color; fallback a gris claro
const getColorHex = (colorName: string): string => {
  if (!colorName) return '#cccccc'
  const key = colorName.trim().toLowerCase()
  return appleColors[key] || '#cccccc'
}
</script>

<style scoped>
.product-store {
  padding: 3rem 0;
  background: linear-gradient(135deg, #dad1d1 0%, #f3f0f0 100%);
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.store-header {
  text-align: center;
  margin-bottom: 2rem;
}

.store-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--brand-primary);
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.store-title .highlight {
  color: var(--brand-success);
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.store-subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

/* Barra de búsqueda */
.search-bar {
  display: flex;
  justify-content: center;
  margin: 1.25rem 0 2rem;
  position: relative;
}

.search-input-wrapper{
  position: relative;
  width: 100%;
  max-width: 720px;
}

.search-icon{
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9aa4ae;
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3.5rem 0.875rem 2.75rem;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #f5f5f7;
  font-size: 1rem;
  color: var(--brand-primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  background: white;
  border-color: var(--brand-success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-input:hover {
  background: #ebebed;
  border-color: #b8b8b8;
}

.search-input::placeholder {
  color: #6b7280;
  opacity: 1;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.08);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: rgba(0,0,0,0.12);
  transform: translateY(-50%) scale(1.05);
}

@media (max-width: 768px){
  .search-input { max-width: 92%; }
  .search-input-wrapper{ max-width: 92%; margin: 0 auto; }
}

/* Filtros */
.category-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e5e5;
  background: white;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: var(--brand-success);
  background: var(--brand-success);
  color: white;
  transform: translateY(-2px);
}

/* Grid de productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(310px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: center;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .category-filters {
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 20px;
  }
}

@media (max-width: 400px) {
  .category-filters {
    gap: 0.4rem;
    margin-bottom: 1.5rem;
  }

  .filter-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 18px;
    border-width: 1.5px;
  }
}

.product-category-top {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(16, 185, 129, 0.9);
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.product-status-image {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.product-status-image.status-available {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.product-status-image.status-coming-soon {
  background: rgba(251, 191, 36, 0.9);
  color: white;
}

.product-status-image.status-out-of-stock {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 160px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--brand-danger);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 15px;
  font-weight: 700;
  font-size: 0.9rem;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.product-info {
  padding: 0.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
  color: var(--brand-primary);
}

.product-description {
  color: #666;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  font-size: 0.9rem;
  text-align: justify;
  hyphens: auto;
}

/* Colores del producto */
.product-colors {
  margin-bottom: 0.8rem;
}

.colors-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--brand-primary);
  margin-bottom: 0.3rem;
  display: block;
}

.colors-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #374151;
  transition: all 0.3s ease;
  cursor: pointer;
}

.colors-select:focus {
  outline: none;
  border-color: var(--brand-success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.colors-select:hover {
  border-color: #d1d5db;
}

/* Contenedor de precio y colores */
.price-colors-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--brand-success);
}

.original-price {
  font-size: 1.1rem;
  text-decoration: line-through;
  color: #999;
}

.product-colors-inline {
  display: flex;
  align-items: center;
}

.product-colors-inline .colors-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.8rem;
  background: white;
  cursor: pointer;
  min-width: 100px;
}

/* Estado del producto */
.product-status {
  margin-bottom: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-available {
  background-color: #d1fae5;
  color: #065f46;
}

.status-coming-soon {
  background-color: #fef3c7;
  color: #92400e;
}

.status-out-of-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-unavailable {
  background-color: #f3f4f6;
  color: #6b7280;
}

/* Controles del carrito */
.cart-controls {
  margin-top: auto;
  padding-top: 1rem;
}

.btn-add-cart {
  width: 100%;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, var(--brand-success) 0%, #0d9466 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-add-cart::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-add-cart:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d9466 0%, #059669 100%);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-add-cart:hover:not(:disabled)::before {
  left: 100%;
}

.btn-add-cart:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
}

.btn-add-cart:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  transform: none;
}

.btn-add-cart svg {
  transition: transform 0.3s ease;
}

.btn-add-cart:hover:not(:disabled) svg {
  transform: scale(1.1);
}

/* Selector de colores */
.color-selection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.color-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
}

.btn-confirm-color {
  padding: 0.5rem 1rem;
  background: var(--brand-success);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm-color:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm-color:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 0.875rem;
  border: 2px solid rgba(16, 185, 129, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.quantity-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--brand-success) 0%, #0d9466 100%);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.quantity-btn:hover {
  background: linear-gradient(135deg, #0d9466 0%, #059669 100%);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.quantity-btn:active {
  transform: scale(0.95);
}

.quantity-display {
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 30px;
  text-align: center;
  color: var(--brand-success);
  background: white;
  padding: 0.5rem;
  border-radius: 10px;
  border: 2px solid rgba(16, 185, 129, 0.2);
}

/* Carrito flotante */
.floating-cart {
  position: fixed;
  bottom: 500px;
  right: 20px;
  background: var(--brand-success);
  color: white;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.floating-cart:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
}

.cart-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--brand-danger);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.cart-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 1001;
}

.cart-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.8);
}

.floating-cart:hover .cart-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Modal del carrito */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(8px);
}

.cart-modal {
  background: var(--brand-surface);
  border-radius: 20px;
  max-width: 900px; /* Cambiado de 600px a 900px para desktop */
  width: 100%;
  max-height: 85vh; /* Aumentado un poco */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--brand-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.cart-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--brand-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--brand-surface);
}

.cart-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--brand-primary-contrast);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  color: var(--brand-primary-contrast);
}

.close-btn:hover {
  background: var(--brand-border);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 2rem;
  background: var(--brand-surface);
}

.empty-cart {
  text-align: center;
  padding: 3rem 0;
  color: rgba(255, 255, 255, 0.6);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--brand-bg-end);
  border-radius: 15px;
  border: 1px solid var(--brand-border);
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.25rem;
  color: var(--brand-primary-contrast);
}

.item-category {
  font-size: 0.9rem;
  color: var(--brand-success);
  font-weight: 600;
}

.item-color {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  background: var(--brand-border);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  display: inline-block;
  margin-top: 0.3rem;
  font-weight: 500;
}

.item-price {
  font-weight: 700;
  color: var(--brand-success);
  margin-top: 0.5rem;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.remove-btn {
  background: var(--brand-danger);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.cart-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid var(--brand-border);
  background: var(--brand-surface);
}

.cart-total-display {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: var(--brand-primary-contrast);
  font-weight: 700;
}

.cart-actions {
  display: flex;
  gap: 1rem;
}

.btn-clear,
.btn-checkout {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear {
  background: var(--brand-border);
  color: rgba(255, 255, 255, 0.8);
}

.btn-clear:hover {
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
}

.btn-checkout {
  background: var(--brand-success);
  color: white;
}

.btn-checkout:hover {
  background: #0d9466;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .store-title {
    font-size: 2.2rem;
  }

  .floating-cart {
    bottom: 350px;
    right: 8px;
    padding: 0.75rem;
    width: 55px;
    height: 55px;
  }

  .cart-tooltip {
    display: none;
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 0.8rem;
    text-align: center;
    white-space: nowrap;
    bottom: 100%;
    left: -150%;
    transform: translateX(-50%);
    margin-bottom: 0.5rem;
    z-index: 1000;
  }

  .floating-cart:hover .cart-tooltip,
  .floating-cart:active .cart-tooltip {
    display: block;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cart-overlay {
    padding: 0.5rem;
  }

  .cart-modal {
    max-height: 95vh;
    max-width: none;
    margin: 0;
    border-radius: 15px;
  }

  .cart-header {
    padding: 1.5rem 1rem 1rem;
  }

  .cart-header h3 {
    font-size: 1.3rem;
  }

  .cart-content {
    padding: 1rem;
  }

  .cart-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .cart-item img {
    width: 60px;
    height: 60px;
  }

  .item-details h4 {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }

  .item-category {
    font-size: 0.8rem;
  }

  .item-color {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }

  .item-price {
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }

  .cart-footer {
    padding: 1rem;
  }

  .cart-total-display {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .cart-actions {
    flex-direction: column;
  }

  .quantity-controls {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .quantity-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .quantity-display {
    font-size: 0.9rem;
    padding: 0.3rem;
    min-width: 24px;
  }
}

/* Estilos del modal de producto */
.product-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.product-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--brand-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.modal-image {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.image-gallery {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.image-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 500px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.image-gallery img.active {
  opacity: 1;
}

.image-dots {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 0 20px;
}

.image-dots button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #ddd;
  cursor: pointer;
  transition: background 0.3s ease;
}

.image-dots button.active {
  background: var(--brand-primary);
}

.image-dots button:hover {
  background: #bbb;
}

.modal-discount-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--brand-danger);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
}

.modal-info {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-category {
  color: var(--brand-success);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-product-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand-primary);
  margin: 0;
}

.modal-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

.modal-colors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.colors-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary);
  margin: 0;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option:hover {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.color-option.selected {
  border-color: var(--brand-success);
  background: rgba(16, 185, 129, 0.1);
  transform: scale(1.05);
}

.color-circle-large {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-name-large {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  text-align: center;
}

.modal-prices {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--brand-success);
}

.modal-original-price {
  font-size: 1.5rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.modal-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.available {
  background: rgba(16, 185, 129, 0.1);
  color: var(--brand-success);
}

.status-badge.out-of-stock {
  background: rgba(239, 68, 68, 0.1);
  color: var(--brand-danger);
}

.status-badge.coming-soon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.modal-cart-controls {
  margin-top: auto;
  padding-top: 1rem;
}

.modal-add-cart-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, var(--brand-success) 0%, #0d9466 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.modal-add-cart-btn:hover:not(.disabled) {
  background: linear-gradient(135deg, #0d9466 0%, #059669 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.modal-add-cart-btn.disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  transform: none;
}

/* Responsive del modal */
@media (max-width: 768px) {
  .product-modal-overlay {
    padding: 1rem;
  }

  .product-modal {
    max-width: 100%;
    flex-direction: column;
  }

  .modal-content {
    flex-direction: column;
  }

  .modal-image {
    min-height: 300px;
  }

  .modal-info {
    padding: 1.5rem;
  }

  .modal-product-name {
    font-size: 1.5rem;
  }

  .modal-current-price {
    font-size: 2rem;
  }

  .colors-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--brand-primary);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.modal-close.floating {
  position: absolute;
  top: 45px;
  right: 30rem;
  z-index: 10;
  background: rgba(146, 144, 144, 0.836);
  backdrop-filter: blur(4px);
}

.modal-close.floating:hover {
  background: rgba(95, 121, 146, 0.85);
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.modal-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-category {
  display: inline-block;
  background: var(--brand-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.modal-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-current-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--brand-success);
}

.modal-original-price {
  font-size: 1.3rem;
  text-decoration: line-through;
  color: #999;
}

.modal-colors {
  margin-bottom: 1.5rem;
}

.modal-colors h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--brand-primary);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.color-option:hover {
  background: #f8f9fa;
}

.color-option.active {
  border-color: var(--brand-primary);
  background: #f0f9ff;
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

  .color-name {
    font-size: 0.8rem;
    color: #666;
    text-align: center;
  }

  .modal-status {
    margin-bottom: 1.5rem;
  }

  .image-navigation {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    pointer-events: none;
  }

  .nav-btn {
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    pointer-events: auto;
  }

  .nav-btn:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .image-thumbnails {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    overflow-x: auto;
    padding: 0.5rem;
    scrollbar-width: thin;
  }

  .thumbnail {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .thumbnail.active {
    border-color: var(--brand-success);
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }.modal-add-to-cart {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--brand-success) 0%, #0d9466 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.modal-add-to-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #ccc;
  box-shadow: none;
}

.modal-add-to-cart:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-image {
    height: 200px;
  }

  .modal-close.floating {
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close.floating svg {
    width: 20px;
    height: 20px;
    stroke: white;
  }

  .color-options {
    gap: 0.5rem;
  }

  .color-circle {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .quantity-controls {
    gap: 0.3rem;
    padding: 0.4rem;
  }

  .quantity-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    font-size: 0.8rem;
  }

  .quantity-display {
    font-size: 0.8rem;
    padding: 0.2rem;
    min-width: 20px;
  }
}

/* === MODAL DEL PRODUCTO (copiado de AppleWatchPage) === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
  padding: 20px;
}

.modal-content {
  background: #1d1d1f;
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-close.floating {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f5f5f7;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.modal-close.floating:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: rotate(90deg);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.modal-image {
  position: relative;
}

.image-gallery {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.image-gallery img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.05);
}

.image-gallery img:hover {
  transform: scale(1.05);
}

.image-gallery img.active {
  border-color: #0071e3;
  box-shadow: 0 0 20px rgba(0, 113, 227, 0.4);
}

.image-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.image-dots button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.image-dots button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.image-dots button.active {
  background: #0071e3;
  width: 24px;
  border-radius: 4px;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #f5f5f7;
  letter-spacing: -0.5px;
}

.modal-category {
  color: #86868b;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.modal-description {
  color: #a1a1a6;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.modal-current-price {
  font-size: 32px;
  font-weight: 700;
  color: #0071e3;
}

.modal-original-price {
  font-size: 20px;
  color: #86868b;
  text-decoration: line-through;
}

.modal-colors {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.modal-colors h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #f5f5f7;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}

.color-option:hover {
  background: rgba(255, 255, 255, 0.05);
}

.color-option.active .color-circle {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.3);
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-name {
  font-size: 12px;
  color: #a1a1a6;
  text-align: center;
  max-width: 80px;
}

.modal-status {
  display: flex;
  gap: 8px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-available {
  background: rgba(52, 199, 89, 0.15);
  color: #34c759;
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.status-coming-soon {
  background: rgba(255, 204, 0, 0.15);
  color: #ffcc00;
  border: 1px solid rgba(255, 204, 0, 0.3);
}

.status-out-of-stock {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.status-unavailable {
  background: rgba(142, 142, 147, 0.15);
  color: #8e8e93;
  border: 1px solid rgba(142, 142, 147, 0.3);
}

.modal-add-to-cart {
  background: linear-gradient(135deg, #0071e3 0%, #0051a8 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 113, 227, 0.3);
  margin-top: auto;
}

.modal-add-to-cart:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(0, 113, 227, 0.4);
  transform: translateY(-2px);
}

.modal-add-to-cart:disabled {
  background: rgba(142, 142, 147, 0.2);
  color: #8e8e93;
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive para modal de producto */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
    padding: 0;
    overflow-y: auto;
  }

  .modal-body {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 24px;
    min-height: 100%;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-current-price {
    font-size: 24px;
  }

  .floating-cart {
    bottom: 350px;
    right: 8px;
    padding: 0.75rem;
    width: 55px;
    height: 55px;
  }

  .cart-tooltip {
    display: none;
  }

  .floating-cart:hover .cart-tooltip,
  .floating-cart:active .cart-tooltip {
    display: block;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cart-overlay {
    padding: 0.5rem;
  }

  .cart-modal {
    width: 95%;
    max-height: 95vh;
    max-width: none;
    margin: 0;
    border-radius: 15px;
  }

  .cart-header {
    padding: 1.5rem 1rem 1rem;
  }

  .cart-header h3 {
    font-size: 1.3rem;
  }

  .cart-content {
    padding: 1rem;
  }

  .cart-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .cart-item img {
    width: 60px;
    height: 60px;
  }

  .item-details h4 {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }

  .item-category {
    font-size: 0.8rem;
  }

  .item-color {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }

  .item-price {
    font-size: 0.9rem;
    margin-top: 0.3rem;
  }

  .cart-footer {
    padding: 1rem;
  }

  .cart-total-display {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .cart-actions {
    flex-direction: column;
  }

  .quantity-controls {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .quantity-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .quantity-controls span {
    font-size: 0.9rem;
    padding: 0.3rem;
    min-width: 24px;
  }
}
</style>
