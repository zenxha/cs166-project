import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useGlobalStore } from './global';

export interface UserData {
  login: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const activeUser = ref<UserData | null>(null);
  const isAuthenticated = computed(() => Boolean(activeUser.value));
  const isAdmin = computed(() => Boolean(activeUser.value?.role == 'admin'));
  const username = computed(() => activeUser.value?.login || '');

  function login(userData: UserData) {
    activeUser.value = userData;
  }

  function logout() {
    const globalStore = useGlobalStore();
    globalStore.triggerLogout();

    activeUser.value = null;
  }

  return { user: activeUser, isAuthenticated, isAdmin, username, login, logout };
});
