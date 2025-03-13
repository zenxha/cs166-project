import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: number; name: string; role: string } | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function login(userData: { id: number; name: string; role: string }) {
    user.value = userData
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})
