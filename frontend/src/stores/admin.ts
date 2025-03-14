import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axiosInstance';

export type User = {
  login: string;
  role: 'customer' | 'driver' | 'manager';
  favoriteItem: string;
  phoneNum: string;
};

export const useAdminStore = defineStore('manager', () => {
  const users = ref<User[]>([]);
  const searchQuery = ref('');
  const sortField = ref<'login'  | 'role' | null>(null);
  const sortOrder = ref<'asc' | 'desc' | null>(null);

  async function fetchUsers() {
    try {
      const response = await api.get<User[]>('/api/users');
      users.value = response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }

  async function updateUser(login: string, updates: Partial<User>) {
    try {
      const response = await api.put(`/api/users/${login}`, updates);
      const index = users.value.findIndex((u) => u.login === login);
      if (index !== -1) users.value[index] = response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }

  const filteredUsers = computed(() => {
    let result = [...users.value];

    if (searchQuery.value) {
      result = result.filter(
        (user) =>
          user.login.toLowerCase().includes(searchQuery.value.toLowerCase()));
    }

    if (sortField.value && sortOrder.value) {
      result.sort((a, b) => {
        const valA = a[sortField.value as keyof User];
        const valB = b[sortField.value as keyof User];

        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  return { users, searchQuery, sortField, sortOrder, fetchUsers, updateUser, filteredUsers };
});
