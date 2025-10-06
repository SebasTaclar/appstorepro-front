<template>
  <div class="apple-products-showcase">
    <div class="container">
      <h2 class="showcase-title">Novedades Apple Store Pro</h2>
      <p class="showcase-subtitle">Lanzamientos recientes y actualizaciones clave del ecosistema Apple.</p>

      <div class="products-grid">
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
import { computed, ref } from 'vue'
import { useProducts } from '@/composables/useProducts'

// Usar el composable de productos para novedades
const { showcaseProducts, getCategoryById } = useProducts()

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
const products = computed(() =>
  showcaseProducts.value.map(product => ({
    id: parseInt(product.id),
    name: product.name,
    description: product.description,
    image: product.image,
    category: getCategoryById(product.category)?.name || 'Sin categoría'
  }))
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.25rem;
  margin-top: 0.25rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
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
  width: 140px;
  height: 140px;
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
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
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
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: #1f1f1f;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    grid-template-columns: repeat(4, 1fr);
    max-width: 800px;
  }
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 600px;
    gap: 1.2rem;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 400px;
    gap: 1rem;
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

  .modal-content {
    width: 95%;
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
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 400px;
    gap: 0.8rem;
  }

  .product-image-circular {
    width: 120px;
    height: 120px;
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
}
</style>

