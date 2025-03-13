<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';

import EditUserModal from '@/components/EditUserModal.vue';

const adminStore = useAdminStore();
const selectedUser = ref<User | null>(null);
const editField = ref<'name' | 'email' | null>(null);
const isModalOpen = ref(false);

onMounted(() => {
  adminStore.fetchUsers();
});

const openEditModal = (user: User, field: 'name' | 'email') => {
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

    <!-- Search & Sort Controls -->
    <div class="mb-4 flex space-x-4">
      <input
        v-model="adminStore.searchQuery"
        type="text"
        placeholder="Search users..."
        class="w-1/3 rounded border p-2"
      />

      <select v-model="adminStore.sortField" class="rounded border p-2">
        <option :value="null">Sort By</option>
        <option value="login">Login</option>
        <option value="email">Email</option>
        <option value="role">Role</option>
      </select>

      <select v-model="adminStore.sortOrder" class="rounded border p-2">
        <option :value="null">Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- User Table -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 p-2">Login</th>
          <th class="border border-gray-300 p-2">Email</th>
          <th class="border border-gray-300 p-2">Role</th>
          <th class="border border-gray-300 p-2">Phone</th>
          <th class="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in adminStore.filteredUsers" :key="user.login">
          <td
            class="cursor-pointer border border-gray-300 p-2 hover:underline"
            @click="openEditModal(user, 'login')"
          >
            {{ user.login }}
          </td>
          <td
            class="cursor-pointer border border-gray-300 p-2 hover:underline"
            @click="openEditModal(user, 'email')"
          >
            {{ user.email }}
          </td>
          <td class="border border-gray-300 p-2">
            <select
              v-model="user.role"
              @change="adminStore.updateUser(user.login, { role: user.role })"
              class="rounded border p-1"
            >
              <option value="customer">Customer</option>
              <option value="driver">Driver</option>
              <option value="admin">Manager</option>
            </select>
          </td>
          <td
            class="cursor-pointer border border-gray-300 p-2 hover:underline"
            @click="openEditModal(user, 'phoneNum')"
          >
            {{ user.phoneNum }}
          </td>
          <td class="border border-gray-300 p-2">
            <button
              @click="adminStore.updateUser(user.login, { role: 'customer' })"
              class="cursor-pointer text-blue-500 hover:underline"
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
