<script setup lang="ts">
import { onMounted } from 'vue'
import { useMenuStore } from '@/stores/menu'
import MenuItemCard from '@/components/MenuItemCard.vue'

const menuStore = useMenuStore()

// Fetch menu items on mount
onMounted(() => {
  menuStore.fetchMenu()
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Menu</h1>

    <!-- Filters -->
    <div class="flex space-x-4 mb-4">
      <select v-model="menuStore.filterType" class="p-2 border rounded">
        <option :value="null">All Types</option>
        <option value="main">Main Dishes</option>
        <option value="drink">Drinks</option>
        <option value="side">Sides</option>
      </select>

      <select v-model="menuStore.sortOrder" class="p-2 border rounded">
        <option :value="null">No Sorting</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>

    <!-- Menu List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MenuItemCard v-for="item in menuStore.filteredItems" :key="item.id" :item="item" />
    </div>
  </div>
</template>
