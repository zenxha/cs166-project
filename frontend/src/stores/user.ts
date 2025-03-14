import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import api from '@/api/axiosInstance';

import { useGlobalStore } from './global';
import { useAuthStore } from './auth';

interface UserProfile {
  phoneNum: string;
  favoriteItem: string;
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
      const response = await api.get<UserProfile>('/api/user/profile', {
        headers: { Authorization: `Bearer ${authStore.token}` }, // Send token in header
      });
      profile.value = response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }

  async function updateProfile(phoneNum: string, favoriteItem: string) {
    if (!profile.value || !authStore.token) {
      console.warn('No auth token or profile found.');
      return;
    }

    try {
      await api.put(
        '/api/user/profile',
        { phoneNum, favoriteItem },
        { headers: { Authorization: `Bearer ${authStore.token}` } }, // Send token in header
      );
      profile.value.phoneNum = phoneNum;
      profile.value.favoriteItem = favoriteItem;
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
