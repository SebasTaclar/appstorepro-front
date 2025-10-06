<template>
  <div class="admin-page">
    <AdminDashboardSimple />
  </div>
</template>

<script setup lang="ts">
import AdminDashboardSimple from '@/components/AdminDashboardSimple.vue'
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fffe 0%, #f0fdf9 100%);
}
</style>
