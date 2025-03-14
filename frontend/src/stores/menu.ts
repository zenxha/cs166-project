import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import api from '@/api/axiosInstance';
import { useAuthStore } from './auth';

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

      const authStore = useAuthStore();

      console.log(filterType.value, "is ft value");
      const response = await api.get<MenuItem[]>('/api/menu', {
        params: {
          type: filterType.value,
          ...(maxPrice.value && { maxprice: maxPrice.value }),
          sort: sortOrder.value,
        },
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      if (typeof response.data !== 'object' || !Array.isArray(response.data)) {
        items.value = [
          {
            id: 1,
            itemname: 'Test',
            ingredients: 'None',
            price: 10.0,
            typeofitem: 'entree',
            description: ' Nothing',
          },
        ];
        throw new Error('Received invalid menu data');
      }

      items.value = response.data;
    } catch (error) {
      console.log(error);
    }
  }

  watch([filterType, maxPrice, sortOrder], fetchMenu);

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
