<template>
  <main class="home-main">
    <section class="section">
      <MainBanner @showRules="openRulesModal" />
    </section>
    <section class="section">
      <ProductShowcase />
    </section>

    <section class="section">
      <ProductStore />
    </section>

    <section class="section">
      <ContactSection />
    </section>


    <section class="section offset">
      <Footer_ />
    </section>

    <!-- Enlace flotante para prueba de sincronización -->
    <!-- <router-link to="/test-sync" class="test-sync-link">
      🧪 Probar Sincronización
    </router-link> -->

    <!-- Modal de reglas -->

  </main>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import MainBanner from '@/components/MainBanner.vue';

// Carga diferida (code splitting) de secciones pesadas
const ProductShowcase = defineAsyncComponent(() => import('@/components/ProductShowcase.vue'))
const ProductStore = defineAsyncComponent(() => import('@/components/ProductStore.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/ContactSection.vue'))
const Footer_ = defineAsyncComponent(() => import('@/components/Footer_.vue'))

// Estado del modal de reglas
const showRulesModal = ref(false)

const openRulesModal = () => {
  showRulesModal.value = true
}

const closeRulesModal = () => {
  showRulesModal.value = false
}

defineOptions({
  name: 'HomeView',
});

// Expose variables to template
defineExpose({
  showRulesModal,
  openRulesModal,
  closeRulesModal
});

</script>

<style scoped>
.home-main {
  padding-top: 60px;
  background-color: var(--app-bg-primary);
  color: var(--app-text-primary);
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

.section {
  padding: 0.1px 0 0 0;
  border-bottom: 1px solid var(--app-border-color);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.section:last-child {
  border-bottom: none;
}


/* Enlace flotante para prueba de sincronización */
.test-sync-link {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.test-sync-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #764ba2, #667eea);
}
</style>
