<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const firstName = computed(() => authStore.user?.firstName)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="navbar">
    <div class="navbar-links">
      <router-link to="/" class="nav-btn">Accueil</router-link>
      <router-link to="/parametres" class="nav-btn">Paramètres</router-link>
    </div>
    <div class="navbar-user" ref="dropdownRef">
      <button class="user-btn" @click="toggleDropdown">
        Bonjour {{ firstName }}
        <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
      </button>
      <div v-if="dropdownOpen" class="dropdown-menu">
        <router-link to="/compte" class="dropdown-item" @click="dropdownOpen = false">
          Compte
        </router-link>
        <button class="dropdown-item" @click="logout">
          Se déconnecter
        </button>
      </div>
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

.navbar-user {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.dropdown-arrow {
  font-size: 0.6rem;
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  overflow: hidden;
  z-index: 100;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #333;
  font-size: 0.95rem;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}
</style>
