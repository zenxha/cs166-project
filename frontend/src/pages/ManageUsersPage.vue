<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

onMounted(() => {
  adminStore.fetchUsers();
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Manage Users</h1>

    <!-- Search & Sort Controls -->
    <div class="flex space-x-4 mb-4">
      <input
        v-model="adminStore.searchQuery"
        type="text"
        placeholder="Search users..."
        class="p-2 border rounded w-1/3"
      />

      <select v-model="adminStore.sortField" class="p-2 border rounded">
        <option :value="null">Sort By</option>
        <option value="login">Login</option>
        <option value="email">Email</option>
        <option value="role">Role</option>
      </select>

      <select v-model="adminStore.sortOrder" class="p-2 border rounded">
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
        <tr v-for="user in adminStore.filteredUsers" :key="user.id">
          <td class="border border-gray-300 p-2">{{ user.Login }}</td>
          <td class="border border-gray-300 p-2">{{ user.email }}</td>
          <td class="border border-gray-300 p-2">
            <select
              v-model="user.role"
              @change="adminStore.updateUser(user.id, { role: user.role })"
              class="p-1 border rounded"
            >
              <option value="customer">Customer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td class="border border-gray-300 p-2">
            <input
              v-model="user.phoneNum"
              @blur="adminStore.updateUser(user.id, { phoneNum: user.phoneNum })"
              class="p-1 border rounded w-full"
            />
          </td>
          <td class="border border-gray-300 p-2">
            <button
              @click="adminStore.updateUser(user.id, { role: 'customer' })"
              class="text-blue-500"
            >
              Reset Role
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
