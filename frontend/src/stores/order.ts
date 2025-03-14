import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axiosInstance';
import type { MenuItem } from '@/stores/menu';
import { useAuthStore } from '@/stores/auth';

type Store = {
  storeid: number;
  address: string;
  city: string;
  state: string;
  isopen: string;
  reviewScore: number;
};

type OrderItem = MenuItem & { quantity: number };

export const useOrderStore = defineStore('order', () => {
  const authStore = useAuthStore();
  const stores = ref<Store[]>([]);
  const selectedStore = ref<Store | null>(null);
  const cart = ref<OrderItem[]>([]);
  const orderTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  async function fetchStores() {
    try {
      const response = await api.get<Store[]>('/api/stores', {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      stores.value = response.data;
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  }

  function addToCart(item: MenuItem) {
    const existingItem = cart.value.find((i) => i.itemname === item.itemname);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1 });
    }
  }

  function updateQuantity(itemname: string, quantity: number) {
    if (quantity < 1) quantity = 1; // Prevent invalid values
    const item = cart.value.find((item) => item.itemname === itemname);
    if (item) {
      item.quantity = quantity;
    }
  }

  function removeFromCart(itemname: string) {
    cart.value = cart.value.filter((i) => i.itemname !== itemname);
  }

  async function placeOrder() {
    if (!authStore.isAuthenticated) {
      return { success: false, message: 'You must be logged in to place an order.' };
    }

    if (!selectedStore.value || cart.value.length === 0) {
      return { success: false, message: 'Please select a store and add items to your order.' };
    }

    try {
      const response = await api.post(
        '/api/orders/create',
        {
          login: authStore.username,
          storeid: selectedStore.value.storeid,
          items: cart.value.map(({ itemname, quantity }) => ({
            itemname,
            quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );

      cart.value = []; // Clear the cart after ordering
      return {
        success: true,
        message: `Order placed! Total: $${response.data.totalprice.toFixed(2)}`,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Failed to place order. Please try again.' };
    }
  }

  return {
    stores,
    cart,
    selectedStore,
    orderTotal,
    fetchStores,
    addToCart,
    updateQuantity,
    removeFromCart,
    placeOrder,
  };
});
