<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const phoneNum = ref('');
const favoriteItem = ref('');
const updateMessage = ref<string | null>(null);

onMounted(async () => {
  phoneNum.value = '';
  favoriteItem.value = '';

  await userStore.fetchProfile();
  if (userStore.profile) {
    phoneNum.value = userStore.profile.phoneNum;
    favoriteItem.value = userStore.profile.favoriteItem;
  }
});

const updateProfile = async () => {
  // Prevent toctou attack
  const currentUserId = userStore.profile?.id;
  await userStore.updateProfile(phoneNum.value, favoriteItem.value);

  // Ensure update applies to the same user
  if (userStore.profile?.id === currentUserId) {
    updateMessage.value = 'Profile updated successfully!';
  } else {
    updateMessage.value = null; // Clear if user changed mid-update
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>

    <div v-if="userStore.profile" class="bg-white p-6 rounded shadow-md">
      <p><strong>Name:</strong> {{ userStore.profile.name }}</p>
      <p><strong>Email:</strong> {{ userStore.profile.email }}</p>

      <!-- Editable Fields -->
      <div class="mt-4">
        <label class="block font-semibold">Phone Number:</label>
        <input v-model="phoneNum" type="text" class="w-full p-2 border rounded" />

        <label class="block font-semibold mt-2">Favorite Item:</label>
        <input v-model="favoriteItem" type="text" class="w-full p-2 border rounded" />
      </div>

      <!-- Update Profile Button -->
      <button @click="updateProfile" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full">
        Update Profile
      </button>

      <!-- Confirmation Message -->
      <p v-if="updateMessage" class="mt-2 text-green-600">{{ updateMessage }}</p>
    </div>
  </div>
</template>
