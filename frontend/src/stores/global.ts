import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

export const useGlobalStore = defineStore('global', () => {
  const logoutListeners = ref<Array<() => void>>([]);

  // Register a new logout listener (each store will use this)
  function registerLogoutListener(callback: () => void) {
    logoutListeners.value.push(callback);
  }

  // Call this function to trigger logout across all stores
  function triggerLogout() {
    logoutListeners.value.forEach((callback) => callback()); // Call all registered listeners
    logoutListeners.value = []; // Clear listeners after logout

    router.push('/login');
  }

  return { registerLogoutListener, triggerLogout };
});
