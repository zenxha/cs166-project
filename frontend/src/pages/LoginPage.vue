<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    })
    authStore.login(response.data)
  } catch (error) {
    errorMessage.value = 'Invalid login credentials'
    console.log(error)
  }
}
</script>

<template>
  <div class="flex flex-col items-center flex-grow min-h-screen py-6">
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Login</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full p-2 border rounded mb-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 border rounded mb-2"
      />
      <button @click="login" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>
