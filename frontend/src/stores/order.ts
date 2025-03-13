import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { MenuItem } from '@/stores/menu';
import { useAuthStore } from '@/stores/auth';

type Store = {
  id: number;
  name: string;
  location: string;
  reviewScore: number;
  isOpen: boolean;
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
      const response = await axios.get<Store[]>('/api/stores');
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
      const response = await axios.post('/api/order', {
        login: authStore.username,
        storeId: selectedStore.value.id,
        items: cart.value.map(({itemname, price, quantity }) => ({
          itemname,
          price,
          quantity,
        })),
      });

      cart.value = []; // Clear the cart after ordering
      return {
        success: true,
        message: `Order placed! Total: $${response.data.totalPrice.toFixed(2)}`,
      };
    } catch (error) {
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
