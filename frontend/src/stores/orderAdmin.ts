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
  orderstatus: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  items: OrderReceiptEntry[];
};

export const useOrderAdminStore = defineStore('orderAdmin', () => {
  const orders = ref<Order[]>([]);
  const searchLogin = ref('');
  const sortField = ref<'ordertimestamp' | 'totalprice' | 'orderstatus' | null>(null);
  const sortOrder = ref<'asc' | 'desc' | null>(null);

  async function fetchOrders(login?: string, limit?: number) {
    try {
      let url = '/api/orders';
      if (login || limit) {
        url += `?${login ? `login=${login}` : ''}${limit ? `&limit=${limit}` : ''}`;
      }
      const response = await axios.get<Order[]>(url);
      orders.value = response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }

  async function updateOrderStatus(orderid: number, newStatus: Order['orderstatus']) {
    try {
      const response = await axios.put(`/api/orders/${orderid}`, { orderstatus: newStatus });
      const index = orders.value.findIndex((o) => o.orderid === orderid);
      if (index !== -1) orders.value[index] = response.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  }

  const filteredOrders = computed(() => {
    let result = [...orders.value];

    if (searchLogin.value) {
      result = result.filter((order) =>
        order.login.toLowerCase().includes(searchLogin.value.toLowerCase()),
      );
    }

    if (sortField.value && sortOrder.value) {
      result.sort((a, b) => {
        const valA = a[sortField.value as keyof Order];
        const valB = b[sortField.value as keyof Order];

        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  return {
    orders,
    searchLogin,
    sortField,
    sortOrder,
    fetchOrders,
    updateOrderStatus,
    filteredOrders,
  };
});
