import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import api from '@/api/axiosInstance';

import { useGlobalStore } from './global';
import { useAuthStore } from './auth';

interface UserProfile {
  login: string;
  password: string;
  role: string;
  phonenum: string;
  favoriteitems: string;
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);

  const globalStore = useGlobalStore();
  const authStore = useAuthStore();

  async function fetchProfile() {
    if (!authStore.token) {
      console.warn('No auth token found. User must log in.');
      return;
    }

    try {
      const response = await api.get(`/api/users/${authStore.username}`);
      profile.value = response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }

  async function updateProfile(phonenum: string, favoriteitems: string) {
    if (!profile.value || !authStore.token) {
      console.warn('No auth token or profile found.');
      return;
    }

    try {
      await api.put(
        '/api/user/profile',
        { phoneNum: phonenum, favoriteItem: favoriteitems },
        { headers: { Authorization: `Bearer ${authStore.token}` } }, // Send token in header
      );
      profile.value.phonenum = phonenum;
      profile.value.favoriteitems = favoriteitems;
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  function onLogout() {
    profile.value = null;
  }

  onMounted(() => {
    globalStore.registerLogoutListener(onLogout);
  });

  return { profile, fetchProfile, updateProfile };
});
