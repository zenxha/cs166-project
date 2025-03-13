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
  <div class="flex flex-col items-center flex-grow min-h-screen py-6">
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Register</h2>

      <input
        v-model="fname"
        type="text"
        placeholder="First Name"
        class="w-full p-2 border rounded mb-2"
      />
      <input
        v-model="lname"
        type="text"
        placeholder="Last Name"
        class="w-full p-2 border rounded mb-6"
      />
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
        class="w-full p-2 border rounded mb-6"
      />
      <input
        v-model="phoneNum"
        type="tel"
        placeholder="Phone Number"
        class="w-full p-2 border rounded mb-2"
      />

      <button @click="registerUser" class="w-full bg-green-500 text-white p-2 rounded">
        Register
      </button>

      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500 mt-2">{{ successMessage }}</p>
    </div>
  </div>
</template>
