import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { MenuItem } from '@/stores/menu';

type Store = {
  id: number;
  name: string;
  location: string;
  reviewScore: number;
  isOpen: boolean;
};

type OrderItem = MenuItem & { quantity: number };

export const useOrderStore = defineStore('order', () => {
  const stores = ref<Store[]>([]);
  const selectedStore = ref<Store | null>(null);
  const cart = ref<OrderItem[]>([]);
  const orderTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

  async function fetchStores() {
    try {
      const response = await axios.get<Store[]>('/api/stores');
      stores.value = response.data;
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  }

  function addToCart(item: MenuItem) {
    const existingItem = cart.value.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1 });
    }
  }

  async function placeOrder() {
    if (!selectedStore.value || cart.value.length === 0) {
      return { success: false, message: 'Please select a store and add items to your order.' };
    }

    try {
      const response = await axios.post('/api/order', {
        storeId: selectedStore.value.id,
        items: cart.value.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      });

      cart.value = []; // Clear the cart after ordering
      return { success: true, message: `Order placed! Total: $${response.data.totalPrice.toFixed(2)}` };
    } catch (error) {
      return { success: false, message: 'Failed to place order. Please try again.' };
    }
  }

  return { stores, selectedStore, cart, orderTotal, fetchStores, addToCart, placeOrder };
});
