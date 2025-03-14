import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useGlobalStore } from './global';
import api from '@/api/axiosInstance';

export interface UserData {
  login: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const activeUser = ref<UserData | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => Boolean(activeUser.value));
  const isAdmin = computed(() => Boolean(activeUser.value?.role.includes('manager')));
  const isDriver = computed(() => Boolean(activeUser.value?.role.includes('driver')));

  const username = computed(() => activeUser.value?.login || '');

  function restoreSession() {
    const storedUser = localStorage.getItem('user');
    if (token.value && storedUser) {
      try {
        activeUser.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }

  async function login(login: string, password: string) {
    // activeUser.value = userData;
    try {
      const response = await api.post('/api/auth/login', { login, password });
      token.value = response.data.access_token;
      activeUser.value = response.data.user;

      // Store token securely
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  }

  async function logout() {
    const globalStore = useGlobalStore();
    globalStore.triggerLogout();

    try {
      token.value = null;
      activeUser.value = null;
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Watch token changes and update localStorage
  watch(token, (newToken) => {
    if (!newToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  });

  restoreSession();

  return { activeUser, isAuthenticated, token, isAdmin, isDriver, username, login, logout };
});
