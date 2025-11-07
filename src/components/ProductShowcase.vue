<template>
  <div class="apple-products-showcase">
    <div class="container">
      <h2 class="showcase-title">Novedades Apple Store Pro</h2>
      <p class="showcase-subtitle">Lanzamientos recientes y actualizaciones clave del ecosistema Apple.</p>

      <!-- Vista Desktop: Grid normal -->
      <div class="products-grid desktop-only">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card-circular"
          @click="showProductDetail(product)"
        >
          <div class="circular-container">
            <div class="product-image-circular">
              <img :src="product.image" :alt="product.name" loading="lazy" />
            </div>
            <div class="product-name-circular">
              <h3>{{ product.name }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Móvil: Carruseles por categoría -->
      <div class="mobile-carousels mobile-only">
        <!-- Carrusel iPhone -->
        <div v-if="iphoneProducts.length > 0" class="carousel-section">
          <h3 class="carousel-category-title">iPhone</h3>
          <div class="carousel-wrapper">
            <div class="carousel-track">
              <div
                v-for="product in iphoneProducts"
                :key="product.id"
                class="product-card-circular"
                @click="showProductDetail(product)"
              >
                <div class="circular-container">
                  <div class="product-image-circular">
                    <img :src="product.image" :alt="product.name" loading="lazy" />
                  </div>
                  <div class="product-name-circular">
                    <h3>{{ product.name }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carrusel Mac & iPad -->
        <div v-if="macIpadProducts.length > 0" class="carousel-section">
          <h3 class="carousel-category-title">Mac & iPad</h3>
          <div class="carousel-wrapper">
            <div class="carousel-track">
              <div
                v-for="product in macIpadProducts"
                :key="product.id"
                class="product-card-circular"
                @click="showProductDetail(product)"
              >
                <div class="circular-container">
                  <div class="product-image-circular">
                    <img :src="product.image" :alt="product.name" loading="lazy" />
                  </div>
                  <div class="product-name-circular">
                    <h3>{{ product.name }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carrusel Watch & Accesorios -->
        <div v-if="watchAccessoriesProducts.length > 0" class="carousel-section">
          <h3 class="carousel-category-title">Watch, AirPods & Accesorios</h3>
          <div class="carousel-wrapper">
            <div class="carousel-track">
              <div
                v-for="product in watchAccessoriesProducts"
                :key="product.id"
                class="product-card-circular"
                @click="showProductDetail(product)"
              >
                <div class="circular-container">
                  <div class="product-image-circular">
                    <img :src="product.image" :alt="product.name" loading="lazy" />
                  </div>
                  <div class="product-name-circular">
                    <h3>{{ product.name }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar descripción del producto -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedProduct?.name }}</h2>
          <button class="modal-close" @click="showModal = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedProduct?.image" :alt="selectedProduct?.name" loading="lazy" decoding="async" />
          </div>
          <div class="modal-info">
            <div class="modal-category">
              {{ selectedProduct?.category }}
            </div>
            <p class="modal-description">
              {{ selectedProduct?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'

// Usar el composable de productos para novedades
const { showcaseProducts, getCategoryById, loadShowcaseProducts } = useProducts()

// Cargar productos showcase al montar el componente
onMounted(async () => {
  console.log('🌟 [ProductShowcase] Cargando productos showcase...')
  await loadShowcaseProducts()
})

// Estado para el modal
const showModal = ref(false)
const selectedProduct = ref<{
  id: number
  name: string
  description: string
  image: string
  category: string
} | null>(null)

// Mapear los productos del composable al formato que usa el template
const products = computed(() => {
  const mapped = showcaseProducts.value.map(product => ({
    id: parseInt(product.id),
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    category: getCategoryById(product.category)?.name || 'Sin categoría'
  }))

  // Helper: extraer número de modelo desde el nombre (ej. "iPhone 17 Pro Max" -> 17)
  const extractModelNumber = (name: string): number | null => {
    if (!name) return null
    const m = name.match(/\d+/)
    return m ? parseInt(m[0], 10) : null
  }

  // Separar iPhones y el resto; iPhones primero ordenados por número de modelo descendente
  const iphones = mapped
    .filter(p => p.category.toLowerCase().includes('iphone'))
    .slice()
    .sort((a, b) => {
      const na = extractModelNumber(a.name)
      const nb = extractModelNumber(b.name)
      if (na !== null && nb !== null) return nb - na // mayor -> menor
      if (na !== null) return -1 // a tiene número, poner antes
      if (nb !== null) return 1  // b tiene número, poner antes
      // fallback: por precio descendente, luego por nombre
      const priceDiff = (b.price ?? 0) - (a.price ?? 0)
      if (priceDiff !== 0) return priceDiff
      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    })

  // El resto de productos se ordenan alfabéticamente (A -> Z)
  const others = mapped
    .filter(p => !p.category.toLowerCase().includes('iphone'))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))

  return [...iphones, ...others]
})

// Filtrar productos por categoría (para móvil)
const iphoneProducts = computed(() =>
  // Filtrar y ordenar por número de modelo (mayor -> menor), fallback a precio
  products.value
    .filter(p => p.category.toLowerCase().includes('iphone'))
    .slice()
    .sort((a, b) => {
      const extractModelNumber = (name: string): number | null => {
        if (!name) return null
        const m = name.match(/\d+/)
        return m ? parseInt(m[0], 10) : null
      }
      const na = extractModelNumber(a.name)
      const nb = extractModelNumber(b.name)
      if (na !== null && nb !== null) return nb - na
      if (na !== null) return -1
      if (nb !== null) return 1
      return (b.price ?? 0) - (a.price ?? 0)
    })
)

const macIpadProducts = computed(() =>
  // Filtrar y ordenar por precio de mayor a menor para Mac & iPad
  products.value
    .filter(p => {
      const cat = p.category.toLowerCase()
      return cat.includes('mac') || cat.includes('ipad')
    })
    .slice()
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
)

const watchAccessoriesProducts = computed(() =>
  // Filtrar y ordenar por precio de mayor a menor para Watch & Accesorios
  products.value
    .filter(p => {
      const cat = p.category.toLowerCase()
      return cat.includes('watch') || cat.includes('reloj') ||
             cat.includes('accesorio') || cat.includes('accessory')
    })
    .slice()
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
)

// Funciones para el modal
const showProductDetail = (product: {
  id: number
  name: string
  description: string
  image: string
  category: string
}) => {
  selectedProduct.value = product
  showModal.value = true
}
</script>

<style scoped>
.apple-products-showcase {
  padding: 1rem 0;
  background: #1a1a1a;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.showcase-title {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.15rem;
  color: #ffffff;
}

.showcase-subtitle {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
  text-align: center;
  max-width: 450px;
  margin: 0 auto 1rem;
  line-height: 1.2;
}

/* Mostrar/Ocultar según dispositivo */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

/* Grid para Desktop */
.products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin-top: 0.25rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
}

/* Carruseles para Móvil */
.mobile-carousels {
  width: 100%;
}

.carousel-section {
  margin-bottom: 2.5rem;
}

.carousel-category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #3b82f6;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

.carousel-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* Scroll suave en iOS */
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  padding: 0.5rem 0;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  padding: 0 1rem;
  width: max-content;
}

/* Estilos para tarjetas circulares */
.product-card-circular {
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 160px;
}

.product-card-circular:hover {
  transform: translateY(-8px) scale(1.05);
}

.circular-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.product-image-circular {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #60a5fa;
  margin-bottom: 1rem;
  background: #2a2a2a;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.2);
}

.product-card-circular:hover .product-image-circular {
  border-color: #3b82f6;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
  transform: scale(1.02);
}

.product-image-circular img {
  width: 110%;
  height: 110%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  margin: -5%;
}

.product-card-circular:hover .product-image-circular img {
  transform: scale(1.08);
}

.product-name-circular {
  width: 100%;
}

.product-name-circular h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.2px;
  line-height: 1.3;
  text-align: center;
}

.product-card-circular:hover .product-name-circular h3 {
  color: #3b82f6;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #2a2a2a;
  border-radius: 20px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  border: 1px solid #333;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #333;
  background: #1f1f1f;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #333;
  color: #ffffff;
}

.modal-body {
  padding: 1.5rem;
}

.modal-image {
  width: 100%;
  height: 450px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-info {
  text-align: center;
}

.modal-category {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.modal-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.modal-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .products-grid {
    max-width: 800px;
  }
}

@media (max-width: 1024px) {
  .products-grid {
    max-width: 600px;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  /* Cambiar a vista móvil con carruseles */
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

  .product-image-circular {
    width: 140px;
    height: 140px;
  }

  .product-name-circular h3 {
    font-size: 0.9rem;
  }

  .showcase-title {
    font-size: 1.4rem;
  }

  .carousel-category-title {
    font-size: 1.1rem;
  }

  .carousel-section {
    margin-bottom: 2rem;
  }

  .modal-content {
    width: 95%;
    max-height: 85vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-image {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .product-image-circular {
    width: 130px;
    height: 130px;
  }

  .product-name-circular h3 {
    font-size: 0.85rem;
  }

  .showcase-title {
    font-size: 1.2rem;
  }

  .showcase-subtitle {
    font-size: 0.75rem;
  }

  .carousel-category-title {
    font-size: 1rem;
  }

  .carousel-track {
    gap: 1.2rem;
    padding: 0 0.75rem;
  }
}
</style>

