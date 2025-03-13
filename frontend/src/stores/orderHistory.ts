import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

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

export const useOrderHistoryStore = defineStore('orderHistory', () => {
  const orders = ref<Order[]>([]);
  const totalOrders = ref(0);
  const perPage = ref(5);
  const currentPage = ref(1);
  const username = ref('');

  async function fetchOrderHistory() {
    if (!username.value) return;
    try {
      const response = await axios.get('/api/orders', {
        params: { login: username.value, limit: perPage.value, page: currentPage.value },
      });
      orders.value = response.data.orders;
      totalOrders.value = response.data.totalOrders;
    } catch (error) {
      console.error('Failed to fetch order history:', error);
    }
  }

  const totalPages = computed(() => Math.ceil(totalOrders.value / perPage.value));

  return { orders, totalOrders, perPage, currentPage, totalPages, fetchOrderHistory, username };
});
