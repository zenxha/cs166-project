import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axiosInstance';
import { useAuthStore } from './auth';

export type MenuItem = {
  itemname: string;
  ingredients: string;
  typeofitem: string;
  price: number;
  description: string;
};

export const useMenuAdminStore = defineStore('menuAdmin', () => {
  const menuItems = ref<MenuItem[]>([]);
  const searchQuery = ref('');
  const sortField = ref<'itemname' | 'price' | 'typeofitem' | null>(null);
  const sortOrder = ref<'asc' | 'desc' | null>(null);

  const authStore = useAuthStore();

  async function fetchMenu() {
    try {
      const response = await api.get<MenuItem[]>('/api/menu', {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      menuItems.value = response.data;
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  }

  async function addMenuItem(newItem: MenuItem) {
    try {
      const response = await api.post('/api/menu', newItem, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      menuItems.value.push(response.data);
    } catch (error) {
      console.error('Failed to add menu item:', error);
    }
  }

  const filteredMenuItems = computed(() => {
    let result = [...menuItems.value];

    if (searchQuery.value) {
      result = result.filter((item) =>
        item.itemname.toLowerCase().includes(searchQuery.value.toLowerCase()),
      );
    }

    if (sortField.value && sortOrder.value) {
      result.sort((a, b) => {
        const valA = a[sortField.value as keyof MenuItem];
        const valB = b[sortField.value as keyof MenuItem];

        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  async function updateMenuItem(itemname: string, updates: Partial<MenuItem>) {
    try {
      const response = await api.put(`/api/menu/${itemname}`, updates, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      const index = menuItems.value.findIndex((item) => item.itemname === itemname);
      if (index !== -1) menuItems.value[index] = response.data;
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  }

  return {
    menuItems,
    searchQuery,
    sortField,
    sortOrder,
    fetchMenu,
    addMenuItem,
    updateMenuItem,
    filteredMenuItems,
  };
});
