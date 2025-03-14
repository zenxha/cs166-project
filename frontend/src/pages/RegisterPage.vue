<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axiosInstance';

const router = useRouter();

const login = ref('');
const password = ref('');
const phoneNum = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const registerUser = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!login.value || !password.value || !phoneNum.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  try {
    const response = await api.post('/api/auth/register', {
      login: login.value,
      password: password.value,
      phonenum: phoneNum.value,
    });

    successMessage.value = response.data.message;
    setTimeout(() => router.push('/login'), 500); // Redirect after success
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.';
  }
};
</script>

<template>
  <div class="flex min-h-screen flex-grow flex-col items-center py-6">
    <div class="w-96 rounded-lg bg-white p-6 shadow-md">
      <h2 class="mb-4 text-xl font-bold">Register</h2>
      <input
        v-model="login"
        type="text"
        placeholder="Username"
        class="mb-2 w-full rounded border p-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="mb-2 w-full rounded border p-2"
      />
      <input
        v-model="phoneNum"
        type="tel"
        placeholder="Phone Number"
        class="mb-2 w-full rounded border p-2"
      />

      <button
        @click="registerUser"
        class="w-full cursor-pointer rounded bg-sky-400 p-2 text-white hover:bg-sky-600"
      >
        Register
      </button>

      <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-2 text-green-500">{{ successMessage }}</p>
    </div>
  </div>
</template>
