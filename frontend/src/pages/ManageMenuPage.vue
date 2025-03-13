<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMenuAdminStore } from '@/stores/menuAdmin';
import { useRouter } from 'vue-router';
import EditMenuItemModal from '@/components/EditMenuItemModal.vue';

import type { MenuItem } from '@/stores/menuAdmin';

const menuAdminStore = useMenuAdminStore();
const showAddModal = ref(false);

const selectedItem = ref<MenuItem | null>(null);
const isModalOpen = ref(false);

const router = useRouter();

// New Menu Item Fields
const newItem = ref({
  itemname: '',
  ingredients: '',
  typeofitem: '',
  price: 0,
  description: '',
});

onMounted(() => {
  menuAdminStore.fetchMenu();
});

const addMenuItem = () => {
  if (!newItem.value.itemname || !newItem.value.typeofitem || newItem.value.price <= 0) {
    alert('Please fill out all fields correctly.');
    return;
  }

  console.log(
    'NewItem:',
    newItem.value.itemname,
    newItem.value.typeofitem,
    newItem.value.price,
    newItem.value.description,
  );

  menuAdminStore.addMenuItem({ ...newItem.value });
  showAddModal.value = false;
  newItem.value = { itemname: '', ingredients: '', typeofitem: '', price: 0, description: '' };
};

const openEditModal = (item: MenuItem) => {
  selectedItem.value = item;
  isModalOpen.value = true;
};

const updateMenuItem = (itemname: string, updates: Partial<MenuItem>) => {
  menuAdminStore.updateMenuItem(itemname, updates);
  isModalOpen.value = false;
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Manage Menu</h1>


    <div class="mb-4 flex space-x-4">
      <button
        @click="router.push('/manage/orders')"
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
      >
        Manage Orders
      </button>
      <button
        @click="router.push('/manage/users')"
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
      >
        Manage Users
      </button>
    </div>

    <!-- Search & Sort Controls -->
    <div class="mb-4 flex space-x-4">
      <input
        v-model="menuAdminStore.searchQuery"
        type="text"
        placeholder="Search menu..."
        class="w-1/3 rounded border p-2"
      />

      <select v-model="menuAdminStore.sortField" class="rounded border p-2">
        <option :value="null">Sort By</option>
        <option value="itemname">Item Name</option>
        <option value="price">Price</option>
        <option value="typeofitem">Category</option>
      </select>

      <select v-model="menuAdminStore.sortOrder" class="rounded border p-2">
        <option :value="null">Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Menu Table -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 p-2">Item Name</th>
          <th class="border border-gray-300 p-2">Ingredients</th>
          <th class="border border-gray-300 p-2">Category</th>
          <th class="border border-gray-300 p-2">Price</th>
          <th class="border border-gray-300 p-2">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in menuAdminStore.filteredMenuItems" :key="item.itemname">
          <td class="border border-gray-300 p-2 hover:underline" @click="openEditModal(item)">
            {{ item.itemname }}
          </td>
          <td class="border border-gray-300 p-2">{{ item.ingredients }}</td>
          <td class="border border-gray-300 p-2">{{ item.typeofitem }}</td>
          <td class="border border-gray-300 p-2">${{ item.price.toFixed(2) }}</td>
          <td class="border border-gray-300 p-2">{{ item.description }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Add Menu Item Button -->
    <button @click="showAddModal = true" class="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
      Add New Item
    </button>

    <!-- Add Item Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black/50">
      <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-lg font-bold">Add New Menu Item</h2>
        <input
          v-model="newItem.itemname"
          type="text"
          placeholder="Item Name"
          class="mb-2 w-full rounded border p-2"
        />
        <input
          v-model="newItem.ingredients"
          type="text"
          placeholder="Ingredients"
          class="mb-2 w-full rounded border p-2"
        />
        <input
          v-model="newItem.typeofitem"
          type="text"
          placeholder="Category"
          class="mb-2 w-full rounded border p-2"
        />
        <input
          v-model="newItem.price"
          type="number"
          placeholder="Price"
          class="mb-2 w-full rounded border p-2"
        />
        <textarea
          v-model="newItem.description"
          placeholder="Description"
          class="mb-2 w-full rounded border p-2"
        ></textarea>
        <div class="flex justify-end space-x-2">
          <button @click="showAddModal = false" class="rounded bg-gray-300 px-4 py-2">
            Cancel
          </button>
          <button @click="addMenuItem" class="rounded bg-blue-500 px-4 py-2 text-white">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditMenuItemModal
      v-if="isModalOpen"
      :menuItem="selectedItem"
      :isOpen="isModalOpen"
      @updateItem="updateMenuItem"
      @close="isModalOpen = false"
    />
  </div>
</template>
