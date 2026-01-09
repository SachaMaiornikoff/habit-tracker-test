<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const firstName = computed(() => authStore.user?.firstName)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
    <div class="home-card">
      <h1>Bonjour {{ firstName }}</h1>

      <button @click="handleLogout" class="logout-btn">
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.home-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.home-card h1 {
  margin: 0 0 1.5rem;
  color: #333;
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #0056b3;
}
</style>
