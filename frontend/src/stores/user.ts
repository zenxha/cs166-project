import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNum: string;
  favoriteItem: string;
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);

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

  return { profile, fetchProfile, updateProfile };
});
