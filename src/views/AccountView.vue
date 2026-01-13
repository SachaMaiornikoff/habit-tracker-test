<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import EditAccountModal from '@/components/EditAccountModal.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const showEditModal = ref(false)

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="page-container">
    <h1>Mon Compte</h1>

    <div v-if="user" class="account-card">
      <div class="account-field">
        <label>Prénom</label>
        <p>{{ user.firstName }}</p>
      </div>

      <div class="account-field">
        <label>Nom</label>
        <p>{{ user.lastName }}</p>
      </div>

      <div class="account-field">
        <label>Email</label>
        <p>{{ user.email }}</p>
      </div>

      <div class="account-field">
        <label>Membre depuis</label>
        <p>{{ formatDate(user.createdAt) }}</p>
      </div>

      <button class="btn-edit" @click="showEditModal = true">
        Modifier mes informations
      </button>
    </div>

    <div v-else class="loading">
      Chargement...
    </div>

    <EditAccountModal
      v-if="showEditModal"
      @close="showEditModal = false"
      @updated="showEditModal = false"
    />
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.page-container h1 {
  color: #333;
  margin: 0 0 2rem 0;
}

.account-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.account-field {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.account-field:last-child {
  border-bottom: none;
}

.account-field label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.account-field p {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.loading {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.btn-edit {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #4A90D9;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-edit:hover {
  background: #3a7bc8;
}
</style>
