import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axiosInstance';

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

  async function fetchOrderById() {
    console.log("Fetching order with id", searchOrderId.value);
    if (!searchOrderId.value) {
      errorMessage.value = 'Please enter an Order ID';
      return;
    }

    try {
      const response = await api.get<Order>(`/api/orders/${searchOrderId.value}`);
      console.log("Got response as",response.data)
      order.value = response.data;
      errorMessage.value = null;
    } catch (error) {
      errorMessage.value = 'Order not found. Please check the ID and try again.';
      order.value = null;
    }
  }

  return { order, searchOrderId, errorMessage, fetchOrderById };
});
