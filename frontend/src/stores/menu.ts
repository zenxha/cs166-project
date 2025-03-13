import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export type MenuItem = {
  id: number;
  itemname: string;
  ingredients: string;
  price: number;
  typeofitem: string;
  description: string;
};

export const useMenuStore = defineStore('menu', () => {
  const items = ref<MenuItem[]>([]);
  const filterType = ref<string | null>(null);
  const maxPrice = ref<number | null>(null);
  const sortOrder = ref<'asc' | 'desc' | null>(null);

  async function fetchMenu() {
    try {
      // Construct query parameters
      const params: Record<string, string | number> = {};
      if (filterType.value) params.type = filterType.value;
      if (maxPrice.value !== null) params.maxprice = maxPrice.value;
      if (sortOrder.value) params.sort = sortOrder.value;

      const response = await axios.get<MenuItem[]>('/api/menu', { params });
      items.value = response.data;
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  }

  watch([filterType, maxPrice, sortOrder], fetchMenu);

  async function fetchMenu_old() {
    try {
      const response = await axios.get<MenuItem[]>('/api/menu');
      items.value = response.data;

      // Ensure every item has a unique numeric ID
      items.value = response.data.map((item, index) => ({
        ...item,
        id: item.id || generatePersistentNumericId(item, index),
      }));
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  }

  // Generate a numeric ID based on local storage or fallback to an index-based ID
  function generatePersistentNumericId(item: MenuItem, index: number): number {
    const storedIds = JSON.parse(localStorage.getItem('menuItemNumericIds') || '{}');

    if (!storedIds[item.itemname]) {
      const newId = Object.keys(storedIds).length + 1 || index + 1; // Ensure uniqueness
      storedIds[item.itemname] = newId;
      localStorage.setItem('menuItemNumericIds', JSON.stringify(storedIds));
    }

    return storedIds[item.itemname];
  }

  const filteredItems = computed(() => {
    let result = [...items.value];

    if (filterType.value) {
      result = result.filter((item) => item.typeofitem === filterType.value);
    }

    if (sortOrder.value) {
      result.sort((a, b) => (sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price));
    }

    return result;
  });

  return { items, filteredItems, fetchMenu, filterType, sortOrder, maxPrice };
});
