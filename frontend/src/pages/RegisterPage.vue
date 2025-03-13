<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const fname = ref('');
const lname = ref('');
const email = ref('');
const password = ref('');
const phoneNum = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const registerUser = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!fname.value || !lname.value || !email.value || !password.value || !phoneNum.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }

  try {
    const response = await axios.post('/api/auth/register', {
      fname: fname.value,
      lname: lname.value,
      email: email.value,
      password: password.value,
      phoneNum: phoneNum.value,
    });

    successMessage.value = response.data.message;
    setTimeout(() => router.push('/login'), 2000); // Redirect after success
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
        v-model="fname"
        type="text"
        placeholder="First Name"
        class="mb-2 w-full rounded border p-2"
      />
      <input
        v-model="lname"
        type="text"
        placeholder="Last Name"
        class="mb-6 w-full rounded border p-2"
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="mb-2 w-full rounded border p-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="mb-6 w-full rounded border p-2"
      />
      <input
        v-model="phoneNum"
        type="tel"
        placeholder="Phone Number"
        class="mb-2 w-full rounded border p-2"
      />

      <button @click="registerUser" class="w-full rounded bg-green-500 p-2 text-white">
        Register
      </button>

      <p v-if="errorMessage" class="mt-2 text-red-500">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-2 text-green-500">{{ successMessage }}</p>
    </div>
  </div>
</template>
