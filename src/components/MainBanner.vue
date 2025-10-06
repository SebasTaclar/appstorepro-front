<template>
  <section class="hero-carousel">
    <!-- Carrusel de Imágenes -->
    <div class="carousel-container">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-slide"
        :class="{ 'active': currentSlide === index }"
      >
        <img :src="slide.image" :alt="slide.title" />
        <div class="slide-overlay"></div>
      </div>
    </div>

    <!-- Botón Conocer Más Estratégico -->
    <div class="explore-button-container">
      <button class="btn-explore" @click="exploreProduct(slides[currentSlide])">
        Conocer más
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>

    <!-- Navegación -->
    <div class="carousel-navigation">
      <div class="nav-dots">
        <button
          v-for="(_, index) in slides"
          :key="index"
          @click="goToSlide(index)"
          :class="['nav-dot', { 'active': currentSlide === index }]"
        >
        </button>
      </div>
      <div class="nav-arrows">
        <button @click="previousSlide" class="nav-arrow prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button @click="nextSlide" class="nav-arrow next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Indicador de Progreso -->
    <div class="progress-indicator">
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Tipos
interface ProductSlide {
  image: string
  category: string
  title: string
  description: string
  features: string[]
  id: string
}

// Estado del carrusel
const currentSlide = ref(0)
const autoPlayInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isPlaying = ref(true)

// Datos de productos Apple (fácil de expandir)
const slides = ref<ProductSlide[]>([
  {
    id: 'iphone',
    image: '/images/banner1.jpg',
    category: 'iPhone',
    title: 'iPhone 15 Pro',
    description: 'El iPhone más Pro hasta ahora. Con titanio de grado aeroespacial y el chip A17 Pro más potente.',
    features: ['Titanio', 'Cámara 48MP', 'USB-C', 'Action Button']
  },
  {
    id: 'ipad',
    image: '/images/banner4.jpg',
    category: 'iPad',
    title: 'iPad Pro M2',
    description: 'Versatilidad extrema con el poder del chip M2. Diseño delgado y potencia profesional.',
    features: ['M2 Chip', 'Liquid Retina XDR', 'Apple Pencil 2', 'Thunderbolt / USB 4']
  },
  {
    id: 'macbook',
    image: '/images/banner3.jpg',
    category: 'Mac',
    title: 'MacBook Pro M3',
    description: 'Potencia profesional redefinida. Rendimiento extraordinario para los flujos de trabajo más exigentes.',
    features: ['Chip M3', '22h batería', 'Pantalla Liquid Retina XDR', 'Thunderbolt 4']
  }
])

// Computed
const progressWidth = computed(() => {
  return ((currentSlide.value + 1) / slides.value.length) * 100
})

// Funciones de navegación
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetAutoPlay()
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0
    ? slides.value.length - 1
    : currentSlide.value - 1
  resetAutoPlay()
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetAutoPlay()
}

// Auto-play
const startAutoPlay = () => {
  if (!isPlaying.value) return
  autoPlayInterval.value = setInterval(() => {
    nextSlide()
  }, 2000) // Cambia cada 2 segundos
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  setTimeout(() => {
    startAutoPlay()
  }, 1000) // Pausa 1 segundo antes de reanudar
}

// Funciones de producto
const exploreProduct = (slide: ProductSlide) => {
  // Scroll hacia la sección ProductShowcase
  const productShowcaseElement = document.querySelector('.apple-products-showcase');
  if (productShowcaseElement) {
    productShowcaseElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  console.log('Navegando hacia ProductShowcase desde:', slide.title)
}

// Métodos públicos para control externo
const pauseCarousel = () => {
  isPlaying.value = false
  stopAutoPlay()
}

const resumeCarousel = () => {
  isPlaying.value = true
  startAutoPlay()
}

// Lifecycle
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

// Exposer métodos para uso externo
defineExpose({
  nextSlide,
  previousSlide,
  goToSlide,
  pauseCarousel,
  resumeCarousel,
  addSlide: (slide: ProductSlide) => {
    slides.value.push(slide)
  }
})
</script>

<style scoped>
/* === CARRUSEL INNOVADOR APPLE STORE PRO === */
.hero-carousel {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 600px;
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  background: #000;
}

/* Contenedor del Carrusel */
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.1);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.carousel-slide.active {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.7;
}

/* Overlay simplificado */
.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.15) 100%
  );
  z-index: 3;
}

/* Contenedor del botón estratégico */
.explore-button-container {
  position: absolute;
  bottom: 5rem;
  right: 3rem;
  z-index: 10;
}

.btn-explore {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2.5rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.4s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.btn-explore:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #374151, #4b5563);
  border-color: rgba(255, 255, 255, 0.3);
  scale: 1.05;
}

/* Navegación */
.carousel-navigation {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-dots {
  display: flex;
  gap: 1rem;
}

.nav-dot {
  position: relative;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: visible;
}

.nav-dot:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.nav-dot.active {
  background: #60a5fa;
  transform: scale(1.3);
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.6);
}

.nav-arrows {
  display: flex;
  gap: 0.5rem;
}

.nav-arrow {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-arrow:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

/* Indicador de Progreso */
.progress-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

/* Animaciones */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-carousel {
    height: 70vh;
    min-height: 500px;
    border-radius: 0;
  }

  .explore-button-container {
    bottom: 4rem;
    right: 2rem;
  }

  .carousel-navigation {
    bottom: 1.5rem;
    gap: 1.5rem;
  }

  .nav-arrows {
    display: none; /* Ocultar flechas en móvil */
  }
}

@media (max-width: 480px) {
  .hero-carousel {
    height: 60vh;
    min-height: 450px;
    border-radius: 0;
  }

  .explore-button-container {
    bottom: 3rem;
    right: 1.5rem;
  }

  .btn-explore {
    padding: 0.9rem 2rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }  .carousel-navigation {
    bottom: 1rem;
  }

  .nav-dots {
    gap: 0.8rem;
  }
}
.hero-banner {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
}

.hero-banner:hover .banner-image img {
  transform: scale(1.02);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.banner-content {
  text-align: center;
  color: #ffffff;
  max-width: 600px;
  padding: 2rem;
}

.banner-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out;
}

.banner-title .accent {
  color: #60a5fa;
  text-shadow: 0 0 30px rgba(96, 165, 250, 0.6);
}

.banner-tagline {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 400;
  margin: 0;
  opacity: 0.95;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
  animation: fadeInUp 1s ease-out 0.3s both;
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-banner {
    height: 60vh;
    min-height: 400px;
    border-radius: 0 0 16px 16px;
  }

  .banner-content {
    padding: 1.5rem;
  }

  .banner-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
  }

  .banner-tagline {
    font-size: clamp(1rem, 4vw, 1.4rem);
  }
}

@media (max-width: 480px) {
  .hero-banner {
    height: 50vh;
    min-height: 350px;
    border-radius: 0 0 12px 12px;
  }

  .banner-content {
    padding: 1rem;
  }

  .banner-title {
    font-size: clamp(2rem, 10vw, 3rem);
    margin-bottom: 0.5rem;
  }

  .banner-tagline {
    font-size: clamp(0.9rem, 5vw, 1.2rem);
  }
}
.hero-section {
  position: relative;
  min-height: 100vh;
  background: var(--brand-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  width: 100%;
  text-align: center;
  z-index: 2;
}

/* Hero Header */
.hero-header {
  margin-bottom: 4rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--brand-primary-contrast);
  margin: 0 0 1rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-title .accent {
  color: var(--brand-accent-alt);
  text-shadow: 0 0 20px var(--brand-accent-glow);
}

.hero-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 600;
  color: var(--brand-accent);
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.05em;
}

.hero-tagline {
  font-size: clamp(1rem, 1.8vw, 1.3rem);
  color: var(--brand-accent-alt);
  margin: 0 auto;
  max-width: 600px;
  line-height: 1.5;
  opacity: 0.9;
}

/* Product Showcase */
.product-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.product-slide {
  background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s ease;
  opacity: 0.7;
  transform: scale(0.95);
}

.product-slide.active {
  opacity: 1;
  transform: scale(1);
  border-color: var(--brand-accent);
  box-shadow: 0 12px 40px -8px var(--brand-accent-glow);
}

.product-image {
  width: 100%;
  height: 200px;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-slide:hover .product-image img {
  transform: scale(1.05);
}

.product-info h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 0.5rem 0;
}

.product-info p {
  font-size: 0.95rem;
  color: var(--brand-accent-alt);
  line-height: 1.4;
  margin: 0;
}

/* Navigation Dots */
.nav-dots {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin: 2rem 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--brand-accent);
  transform: scale(1.2);
  box-shadow: 0 0 12px var(--brand-accent-glow);
}

.dot:hover {
  background: var(--brand-accent-alt);
  transform: scale(1.1);
}

/* Benefits Section */
.benefits-section {
  margin: 4rem 0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.benefit-item {
  background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.4s ease;
}

.benefit-item:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.16);
  box-shadow: 0 16px 40px -12px rgba(0,0,0,0.4);
}

.benefit-icon {
  width: 60px;
  height: 60px;
  background: var(--brand-accent-gradient);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 20px -6px var(--brand-accent-glow);
}

.benefit-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 0.8rem 0;
}

.benefit-item p {
  font-size: 0.9rem;
  color: var(--brand-accent-alt);
  line-height: 1.4;
  margin: 0;
}

/* Call to Action */
.cta-section {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.cta-primary, .cta-secondary {
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
}

.cta-primary {
  background: var(--brand-accent-gradient);
  color: #fff;
  box-shadow: 0 8px 25px -8px var(--brand-accent-glow);
}

.cta-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 35px -10px var(--brand-accent-glow);
}

.cta-secondary {
  background: transparent;
  color: var(--brand-accent-alt);
  border: 2px solid rgba(255,255,255,0.2);
}

.cta-secondary:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 1rem;
    min-height: 90vh;
  }

  .product-showcase {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .cta-section {
    flex-direction: column;
    align-items: center;
  }

  .cta-primary, .cta-secondary {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-showcase {
    margin: 1.5rem 0;
  }

  .benefit-item {
    padding: 1.5rem 1rem;
  }
}
.hero-rifa {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hero Apple */
.hero-gallery-section {
  position: relative;
  width: 100%;
  padding: 6rem 2rem 4rem;
  background: radial-gradient(circle at 20% 25%, rgba(59,130,246,0.18) 0%, transparent 55%),
    linear-gradient(135deg, var(--brand-bg-start) 0%, var(--brand-bg-end) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.gallery-container {
  position: relative;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: center;
  overflow-x: visible;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.gallery-header h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.gallery-header .highlight-blue {
  color: #60a5fa;
  text-shadow: 0 0 30px rgba(96, 165, 250, 0.4);
}

/* Contenedor para centrar el contenido debajo de la galería */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}


.modifications-description {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

.highlight-text {
  color: #60a5fa;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

.video-link {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.5rem;
}

.video-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* Galería horizontal */
.horizontal-gallery {
  display: flex;
  width: 100vw;
  margin: 0 0 2rem 0;
  margin-left: calc(-50vw + 50%);
  flex-wrap: nowrap;
  gap: 2rem;
  padding: 2rem;
  padding-bottom: 4.5rem; /* espacio extra para que el texto no quede encima de las fotos */
  background: rgba(15, 23, 42, 0.6);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth; /* Volvemos a smooth para que funcionen los swipes suaves */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  border-radius: 0;
  touch-action: pan-x; /* Mejorar gesto horizontal */
  overscroll-behavior-x: contain; /* Evitar rebote de la página */
}

/* Movimiento suave del inner que se sincroniza con el scroll */

/* Ocultar scrollbar en WebKit */
.horizontal-gallery::-webkit-scrollbar {
  display: none;
}

.gallery-image-item {
  flex: 0 0 400px; /* Ancho fijo para cada imagen */
  position: relative;
  cursor: pointer;
  transition: all 0.15s ease-out; /* Transición más rápida */
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(96, 165, 250, 0.3);
  background: #1e293b;
}

.gallery-image-item:hover {
  transform: translateY(-8px);
  z-index: 10;
  border-color: rgba(96, 165, 250, 0.8);
  box-shadow: 0 12px 35px rgba(96, 165, 250, 0.3);
}

.gallery-image-item.active {
  border-color: #60a5fa;
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-image-item:hover .image-wrapper img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 41, 59, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

.gallery-image-item:hover .image-overlay {
  opacity: 1;
}

.gallery-image-item.active .image-overlay {
  opacity: 0;
}

.image-info {
  text-align: center;
  color: #ffffff;
  padding: 1rem;
}

.image-info h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #60a5fa;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.image-info p {
  font-size: 0.9rem;
  margin: 0;
  color: #e2e8f0;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

/* Navegación con flechas a los lados */
.gallery-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 0;
  z-index: 20;
  pointer-events: none;
}

.gallery-nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 2px solid rgba(96, 165, 250, 0.4);
  border-radius: 50%;
  color: #60a5fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  pointer-events: all;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.gallery-prev {
  left: 2rem;
}

.gallery-next {
  right: 2rem;
}

.gallery-nav-arrow:hover {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.3) 0%, rgba(30, 41, 59, 0.3) 100%);
  border-color: #60a5fa;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0 25px rgba(96, 165, 250, 0.5);
  color: #ffffff;
}

.gallery-nav-arrow svg {
  width: 24px;
  height: 24px;
}

/* Botón agregar fotos */
.add-photos-section {
  text-align: center;
}

.add-photo-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
}

.add-photo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);
}

.add-photo-btn svg {
  width: 20px;
  height: 20px;
}

/* Responsive para la galería horizontal */
@media (max-width: 1024px) {
  .horizontal-gallery {
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 2rem 3rem;
  }

  .gallery-image-item {
    flex: 1 1 calc(50% - 0.75rem);
    min-width: calc(50% - 0.75rem);
  }

  .image-wrapper {
    height: 350px;
  }

  .gallery-header h1 {
    font-size: 3rem;
  }

  .gallery-nav-arrow {
    width: 50px;
    height: 50px;
  }

  .gallery-prev {
    left: 1rem;
  }

  .gallery-next {
    right: 1rem;
  }
}

@media (max-width: 768px) {
  .gallery-header h1 {
    font-size: 2.5rem;
  }

  .horizontal-gallery {
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    gap: 1.5rem;
    padding: 2rem 1rem;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-snap-type: x mandatory;
  }

  .gallery-image-item {
    flex: 0 0 85vw !important;
    min-width: 85vw !important;
    max-width: 85vw !important;
    scroll-snap-align: center;
  }

  .image-wrapper {
    height: 300px;
  }

  .hero-gallery-section { padding: 4rem 1rem 3rem; }

  .gallery-container {
    padding: 0;
  }

  .gallery-nav-arrow {
    width: 45px;
    height: 45px;
  }

  .gallery-nav-arrow svg {
    width: 20px;
    height: 20px;
  }

  .gallery-prev {
    left: 0.5rem;
  }

  .gallery-next {
    right: 0.5rem;
  }

  /* Responsive para modificaciones en tablet */
  .benefits-grid { grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap:18px; }

  .modifications-description {
    font-size: 0.95rem;
  }

  .video-link {
    margin-left: 0.3rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.5rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .gallery-header h1 {
    font-size: 2rem;
    line-height: 1.2;
    padding: 0 1rem;
  }

  .horizontal-gallery {
    padding: 1rem 0.5rem;
    gap: 1rem;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-snap-type: x mandatory;
  }

  .gallery-image-item {
    flex: 0 0 90vw !important;
    min-width: 90vw !important;
    max-width: 90vw !important;
    scroll-snap-align: center;
  }

  .image-wrapper {
    height: 250px;
  }

  .hero-gallery-section { padding: 3rem .75rem 2.5rem; }

  .gallery-nav-arrow {
    width: 40px;
    height: 40px;
  }

  .gallery-nav-arrow svg {
    width: 18px;
    height: 18px;
  }

  .gallery-prev {
    left: 0.25rem;
  }

  .gallery-next {
    right: 0.25rem;
  }

  /* Responsive para modificaciones en móvil */
  .benefits-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap:14px; }

  .modifications-description {
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .video-link {
    margin-left: 15rem;
    margin-top: -1.1rem;
    padding: 0.3rem 1rem;
    font-size: 0.4rem;
    display: block;
    text-align: center;

  }
}

/* Nueva sección de contenido debajo de la galería */
.content-section {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  padding: 4rem 0;
  margin: 2rem 0;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  color: white;
}

/* Estilos específicos para el contenido */
.content-section .verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
}

.content-section .main-title h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.content-section .highlight {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-section .description {
  margin-bottom: 3rem;
}

.content-section .description p {
  font-size: 1.2rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.content-section .action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.content-section .stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

/* Ajustar el contenedor principal para dar espacio a la galería */
.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Contenido izquierdo */
.hero-content {
  color: white;
}

.verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.verification-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

.verification-text {
  color: #22c55e;
}

.main-title {
  margin-bottom: 1.5rem;
}

.main-title h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.highlight {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.description {
  margin: 0 auto 2rem auto;
  text-align: center;
}

.description p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 0 auto 3rem auto;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 400px;
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
/* === Nuevos estilos Apple Store Pro Hero === */
.hero-title { font-size: clamp(2.2rem,4vw,3.4rem); line-height:1.1; font-weight:800; background:linear-gradient(90deg,#fff,#dbeafe); -webkit-background-clip:text; background-clip:text; color:transparent; letter-spacing:-1px; }
.hero-title .accent { color: var(--brand-accent-alt); text-shadow:0 0 18px var(--brand-accent-glow); }
.hero-title .sub { display:block; font-size:clamp(1rem,1.4vw,1.15rem); font-weight:500; letter-spacing:.5px; margin-top:10px; color:var(--brand-accent-alt); }
.hero-tagline { margin-top:18px; font-size:clamp(.9rem,1.2vw,1.05rem); max-width:760px; color:var(--brand-accent-alt); font-weight:400; }
.slide-desc { font-size:.75rem; opacity:.85; margin-top:4px; }

.benefits-wrapper { margin-top:40px; width:100%; position:relative; z-index:5; }
.benefits-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:24px; width:100%; max-width:1000px; margin:0 auto; }
.benefit-card { background:linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)); border:1px solid rgba(255,255,255,0.08); padding:18px 16px 20px; border-radius:18px; position:relative; overflow:hidden; backdrop-filter:blur(10px); transition:all .4s ease; min-height:160px; display:flex; flex-direction:column; gap:8px; }
.benefit-card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 20% 15%,rgba(255,255,255,0.15),transparent 70%); opacity:0; transition:opacity .5s ease; }
.benefit-card:hover::before { opacity:1; }
.benefit-card:hover { transform:translateY(-6px); box-shadow:0 12px 30px -8px rgba(0,0,0,0.45); border-color:rgba(255,255,255,0.18); }
.benefit-icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; color:#fff; box-shadow:0 4px 18px -4px rgba(59,130,246,0.5); }
.benefit-card h4 { font-size:.95rem; margin:4px 0 0; letter-spacing:.5px; font-weight:600; color:var(--brand-primary-contrast); }
.benefit-card p { font-size:.75rem; line-height:1.3; color:var(--brand-accent-alt); margin:0; }

.cta-btn { position:relative; border:none; cursor:pointer; font-weight:600; letter-spacing:.5px; padding:14px 26px; border-radius:14px; font-size:.9rem; display:inline-flex; align-items:center; gap:8px; transition:all .4s; overflow:hidden; }
.cta-btn.primary { background:var(--brand-accent-gradient); color:#fff; box-shadow:0 8px 25px -8px rgba(59,130,246,0.6); }
.cta-btn.primary:hover { transform:translateY(-4px); box-shadow:0 18px 40px -12px rgba(59,130,246,0.7); }
.cta-btn.ghost { background:rgba(255,255,255,0.05); color:var(--brand-accent-alt); border:1px solid rgba(255,255,255,0.15); }
.cta-btn.ghost:hover { background:rgba(255,255,255,0.08); transform:translateY(-3px); }

@media (max-width: 768px) {
  .hero-title { font-size:2.4rem; }
  .benefits-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
}
@media (max-width: 520px) {
  .benefits-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
  .hero-title { font-size:2rem; }
}
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.1);
  border-color: #94a3b8;
  color: white;
}

/* Controles de demo */
.demo-controls {
  display: flex;
  gap: 0.8rem;
  margin: 1rem auto 0 auto;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 600px;
}

.btn-demo {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-demo:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: #60a5fa;
  transform: translateY(-1px);
}

/* Estadísticas */
.stats-section {
  display: grid;
  /* 2 columnas para centrar las dos tarjetas en desktop */
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 0 auto 2rem auto;
  max-width: 800px;
  justify-content: center;
}

/* Clase especial para centrar una sola tarjeta */
.stats-centered {
  display: flex;
  justify-content: center;
  grid-template-columns: none;
}

.stat-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Tip */
.tip-section {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 1rem;
}

.tip-section p {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Producto lado derecho */
.hero-product {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.product-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.nav-btn {
  width: 50px;
  height: 50px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  transform: scale(1.1);
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

.product-showcase {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(51, 65, 85, 0.2) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
}

.product-label {
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.product-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.product-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.product-image {
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

/* Indicadores */
.product-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(148, 163, 184, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  transform: scale(1.2);
}

/* Elementos decorativos */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  top: 50%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .main-title h1 {
    font-size: 2.5rem;
  }

  .stats-section {
  /* Mantener 2 columnas para que las tarjetas queden centradas */
  grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

@media (max-width: 768px) {
  .hero-container {
    padding: 1rem;
    gap: 2rem;
  }

  .main-title h1 {
    font-size: 2rem;
  }

  .action-buttons {
    justify-content: center;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  .demo-controls {
    gap: 0.5rem;
    margin-top: 0.8rem;
  }

  .btn-demo {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .main-title h1 {
    font-size: 1.8rem;
  }

  .description p {
    font-size: 1rem;
  }

  .product-showcase {
    padding: 1rem;
  }

  .product-image-container {
    min-height: 200px;
  }

  .gallery-navigation{
    top: 30%;
  }
}

/* Estilos responsivos para la sección de contenido */
@media (max-width: 1024px) {
  .content-section .main-title h1 {
    font-size: 3.5rem;
  }

  .content-section .action-buttons {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .content-section {
    padding: 3rem 0;
    margin: 1rem;
    border-radius: 16px;
  }

  .content-container {
    padding: 0 1rem;
  }

  .content-section .main-title h1 {
    font-size: 2.5rem;
  }

  .content-section .description p {
    font-size: 1.1rem;
  }

  .content-section .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .content-section .stats-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .content-section {
    padding: 2rem 0;
    margin: 0.5rem;
  }

  .content-section .main-title h1 {
    font-size: 2rem;
  }

  .content-section .description p {
    font-size: 1rem;
  }

  .content-section .verification-badge {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
