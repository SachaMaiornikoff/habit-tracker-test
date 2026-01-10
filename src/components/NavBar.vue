<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const firstName = computed(() => authStore.user?.firstName)
</script>

<template>
  <nav class="navbar">
    <div class="navbar-links">
      <router-link to="/" class="nav-btn">Accueil</router-link>
      <router-link to="/parametres" class="nav-btn">Paramètres</router-link>
    </div>
    <div class="navbar-greeting">
      Bonjour {{ firstName }}
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0066ff;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);
}

.navbar-links {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.nav-btn.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.navbar-greeting {
  color: #fff;
  font-size: 0.95rem;
}
</style>
