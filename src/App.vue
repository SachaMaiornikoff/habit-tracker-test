<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const authStore = useAuthStore()

const showNavbar = computed(() => {
  return authStore.isAuthenticated && route.meta.requiresAuth
})
</script>

<template>
  <NavBar v-if="showNavbar" />
  <RouterView />
</template>

<style scoped>
</style>
