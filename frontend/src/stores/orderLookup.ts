import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axiosInstance';
import { useAuthStore } from './auth';

export type OrderReceiptEntry = {
  itemname: string;
  quantity: number;
};

export type Order = {
  orderid: number;
  login: string;
  storeid: number;
  totalprice: number;
  ordertimestamp: string;
  orderstatus: string;
  items: OrderReceiptEntry[];
};

export const useOrderLookupStore = defineStore('orderLookup', () => {
  const order = ref<Order | null>(null);
  const searchOrderId = ref('');
  const errorMessage = ref<string | null>(null);

  const authStore = useAuthStore();

  async function fetchOrderById() {
    if (!searchOrderId.value) {
      errorMessage.value = 'Please enter an Order ID';
      return;
    }

    try {
      const response = await api.get<Order[]>(`/api/orders/`, {
        params: {
          login: authStore.username,
          orderid: searchOrderId.value,
        },
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      order.value = response.data[0];
      errorMessage.value = null;
    } catch (error) {
      errorMessage.value = 'Order not found. Please check the ID and try again.';
      console.log(error);
      order.value = null;
    }
  }

  return { order, searchOrderId, errorMessage, fetchOrderById };
});
