<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <nav class="bg-blue-600 text-white p-4 flex justify-between">
    <div class="font-bold text-lg">Kessoku Pizza</div>
    <div class="space-x-4">
      <router-link to="/" class="hover:underline">Home</router-link>
      <router-link to="/menu" class="hover:underline">Menu</router-link>
      <router-link v-if="authStore.isAuthenticated" to="/order" class="hover:underline"
        >Order</router-link
      >
      <router-link v-if="authStore.isAuthenticated" to="/profile" class="hover:underline"
        >Profile</router-link
      >
      <router-link v-if="authStore.isAdmin" to="/admin" class="hover:underline">Admin</router-link>
      <router-link v-if="!authStore.isAuthenticated" to="/login" class="hover:underline"
        >Login</router-link
      >
      <button v-if="authStore.isAuthenticated" @click="authStore.logout()" class="hover:underline">
        Logout
      </button>
    </div>
  </nav>
</template>
