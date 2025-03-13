import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useGlobalStore } from './global';

export interface UserData {
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const activeUser = ref<UserData | null>(null);
  const isAuthenticated = computed(() => Boolean(activeUser.value));
  const isAdmin = computed(() => Boolean(activeUser.value?.role == 'admin'));

  function login(userData: UserData) {
    activeUser.value = userData;
  }

  function logout() {
    const globalStore = useGlobalStore();
    globalStore.triggerLogout();

    activeUser.value = null;
  }

  return { user: activeUser, isAuthenticated, isAdmin, login, logout };
});
