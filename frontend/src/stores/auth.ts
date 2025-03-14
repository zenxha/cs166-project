import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

  async function login(login: string, password: string) {
    // activeUser.value = userData;
    try {
      const response = await api.post('/api/auth/login', { login, password });
      console.log(response.data);
      token.value = response.data.access_token;
      activeUser.value = response.data.user;

      // Store token securely
      localStorage.setItem('token', response.data.token);

      console.log(token,"was stored locally!");
      console.log(isAuthenticated,"is isAuthed");
      console.log(isAdmin,"is administrator");

      console.log(response.data);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  }

  async function logout() {
    const globalStore = useGlobalStore();
    globalStore.triggerLogout();

    try {
      // await api.post(
      //   '/api/auth/logout',
      //   {},
      //   { headers: { Authorization: `Bearer ${token.value}` } },
      // );
      token.value = null;
      activeUser.value = null;
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return { activeUser, isAuthenticated, token, isAdmin, isDriver, username, login, logout };
});
