<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
  try {
    authStore.login(username.value, password.value);
    router.push('/');
  } catch (error) {
    errorMessage.value = 'Invalid login credentials';
    console.log(error);
  }
};
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-grow flex-col items-center py-6">
    <div class="w-96 rounded-lg bg-white p-6 shadow-md">
      <h2 class="mb-4 text-xl font-bold">Login</h2>
      <form @submit.prevent="login">
        <input
          v-model="username"
          type="text"
          placeholder="Login"
          class="mb-2 w-full rounded border p-2"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="mb-2 w-full rounded border p-2"
          required
        />
        <button
          @click="login"
          class="mt-4 w-full cursor-pointer rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>

      <div class="mt-4 text-center">
        Don't have an account?
        <router-link to="/register" class="text-blue-500 hover:underline"
          >Register here</router-link
        >
      </div>
    </div>
  </div>
</template>
