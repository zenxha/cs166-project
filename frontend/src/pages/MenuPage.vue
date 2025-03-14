<script setup lang="ts">
import { onMounted } from 'vue';
import { useMenuStore } from '@/stores/menu';
import MenuItemCard from '@/components/MenuItemCard.vue';

const menuStore = useMenuStore();

// Fetch menu items on mount
onMounted(() => {
  menuStore.filterType = null;
  menuStore.maxPrice = null;
  menuStore.sortOrder = null;

  menuStore.fetchMenu();
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Menu</h1>

    <!-- Filters -->
    <div class="mb-4 flex space-x-4">
      <select v-model="menuStore.filterType" class="rounded border p-2">
        <option :value="null">All Types</option>
        <option value="entree">Main Dishes</option>
        <option value="drinks">Drinks</option>
        <option value="sides">Sides</option>
      </select>

      <input
        v-model.number="menuStore.maxPrice"
        type="number"
        placeholder="Max Price"
        class="w-32 rounded border p-2"
      />

      <select v-model="menuStore.sortOrder" class="rounded border p-2">
        <option :value="null">No Sorting</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
    </div>

    <!-- Menu List -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MenuItemCard v-for="item in menuStore.items" :key="item.id" :item="item" />
    </div>
  </div>
</template>
