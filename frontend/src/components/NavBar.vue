<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="flex justify-between bg-blue-600 p-4 text-white">
    <div class="text-lg font-bold">Kessoku Pizza</div>
    <div class="space-x-4">
      <router-link to="/" class="hover:underline">Home</router-link>
      <router-link to="/menu" class="hover:underline">Menu</router-link>
      <router-link v-if="authStore.isAuthenticated" to="/order" class="hover:underline"
        >Order</router-link
      >
      <router-link v-if="authStore.isAuthenticated" to="/profile" class="hover:underline"
        >Profile</router-link
      >
      <router-link v-if="authStore.isAdmin || authStore.isDriver" to="/manage" class="hover:underline"
        >Manage</router-link
      >
      <router-link v-if="!authStore.isAuthenticated" to="/login" class="hover:underline"
        >Login</router-link
      >
      <button v-if="authStore.isAuthenticated" @click="handleLogout()" class="hover:underline">
        Logout
      </button>
    </div>
  </nav>
</template>
