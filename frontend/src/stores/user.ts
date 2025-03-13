import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useGlobalStore } from './global';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  favoriteItem: string;
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);
  const globalStore = useGlobalStore();

  async function fetchProfile() {
    try {
      const response = await axios.get<UserProfile>('/api/user/profile');
      profile.value = response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }

  async function updateProfile(phoneNum: string, favoriteItem: string) {
    if (!profile.value) return;

    try {
      await axios.put('/api/user/profile', { phoneNum, favoriteItem });
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

  return { profile, fetchProfile, updateProfile, onLogout };
});
