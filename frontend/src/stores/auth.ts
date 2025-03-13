import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserData {
  id: number;
  fname: string;
  lname: string;
  role : string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserData | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const fname = computed(() => user.value ? user.value.fname : 'NO NAME FOUND')

  function login(userData: { id: number; fname: string; lname: string; role: string }) {
    user.value = userData
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, fname, login, logout }
})
