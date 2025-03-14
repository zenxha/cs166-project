<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';
import type { User } from '@/stores/admin';
import { useRouter } from 'vue-router';

import EditUserModal from '@/components/EditUserModal.vue';

const adminStore = useAdminStore();
const selectedUser = ref<User | null>(null);
const editField = ref<'login' | 'phonenum' | null>(null);
const isModalOpen = ref(false);

const router = useRouter();

onMounted(() => {
  adminStore.fetchUsers();
});

const openEditModal = (user: User, field: 'login' | 'phonenum') => {
  selectedUser.value = user;
  editField.value = field;
  isModalOpen.value = true;
};

const updateUser = (login: string, updates: Partial<User>) => {
  adminStore.updateUser(login, updates);
  isModalOpen.value = false;
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Manage Users</h1>

    <div class="mb-4 flex space-x-4">
      <button
        @click="router.push('/manage/menu')"
        class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Manage Menu
      </button>
      <button
        @click="router.push('/manage/orders')"
        class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Manage Orders
      </button>
    </div>

    <!-- Search & Sort Controls -->
    <div class="mb-6 flex flex-wrap items-center justify-between rounded-lg bg-white p-4 shadow-md">
      <!-- Search Input -->
      <input
        v-model="adminStore.searchQuery"
        type="text"
        placeholder="Search users..."
        class="w-1/3 min-w-[200px] rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <!-- Sort Field -->
      <select
        v-model="adminStore.sortField"
        class="rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-400 focus:ring focus:outline-none"
      >
        <option :value="null">Sort By</option>
        <option value="login">Login</option>
        <option value="role">Role</option>
      </select>

      <!-- Sort Order -->
      <select
        v-model="adminStore.sortOrder"
        class="rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-400 focus:ring focus:outline-none"
      >
        <option :value="null">Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- User Table -->
    <table class="w-full border-collapse overflow-hidden rounded-lg shadow-lg">
      <thead>
        <tr class="bg-blue-500 text-left text-white">
          <th class="border border-gray-300 p-3">Login</th>
          <th class="border border-gray-300 p-3">Role</th>
          <th class="border border-gray-300 p-3">Phone</th>
          <th class="border border-gray-300 p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in adminStore.filteredUsers"
          :key="user.login"
          class="transition odd:bg-gray-100 hover:bg-gray-200"
        >
          <td
            class="cursor-pointer border border-gray-300 p-3 text-blue-600 hover:underline"
            @click="openEditModal(user, 'login')"
          >
            {{ user.login }}
          </td>
          <td class="border border-gray-300 p-3">
            <select
              v-model="user.role"
              @change="adminStore.updateUser(user.login, { role: user.role })"
              class="rounded-md border border-gray-300 bg-white p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
              <option value="manager">Manager</option>
            </select>
          </td>
          <td
            class="cursor-pointer border border-gray-300 p-3 text-blue-600 hover:underline"
            @click="openEditModal(user, 'phonenum')"
          >
            {{ user.phonenum }}
          </td>
          <td class="border border-gray-300 p-3">
            <button
              @click="adminStore.updateUser(user.login, { role: 'customer' })"
              class="cursor-pointer font-semibold text-blue-500 hover:underline"
            >
              Reset Role
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit User Modal -->
    <!-- @updateUser (event from component) = "updateUser (function from above)" -->
    <EditUserModal
      v-if="isModalOpen"
      :user="selectedUser"
      :field="editField!"
      :isOpen="isModalOpen"
      @updateUser="updateUser"
      @close="isModalOpen = false"
    />
  </div>
</template>
