<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderAdminStore } from '@/stores/orderAdmin';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const orderAdminStore = useOrderAdminStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  orderAdminStore.fetchOrders();
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Manage Orders</h1>

    <div v-if="authStore.isAdmin" class="mb-4 flex space-x-4">
      <button
        @click="router.push('/manage/menu')"
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Manage Menu
      </button>
      <button
        @click="router.push('/manage/users')"
        class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
      >
        Manage Users
      </button>
    </div>

    <!-- Search & Sort Controls -->
    <div class="mb-4 flex space-x-4">
      <input
        v-model="orderAdminStore.searchLogin"
        type="text"
        placeholder="Search by user..."
        class="w-1/3 rounded border p-2"
      />

      <select v-model="orderAdminStore.sortField" class="rounded border p-2">
        <option :value="null">Sort By</option>
        <option value="ordertimestamp">Date</option>
        <option value="totalPrice">Total Price</option>
        <option value="orderstatus">Status</option>
      </select>

      <select v-model="orderAdminStore.sortOrder" class="rounded border p-2">
        <option :value="null">Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Orders Table -->
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 p-2">Order ID</th>
          <th class="border border-gray-300 p-2">User</th>
          <th class="border border-gray-300 p-2">Total</th>
          <th class="border border-gray-300 p-2">Date</th>
          <th class="border border-gray-300 p-2">Status</th>
          <th class="border border-gray-300 p-2">Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orderAdminStore.filteredOrders" :key="order.orderid">
          <td class="border border-gray-300 p-2">{{ order.orderid }}</td>
          <td class="border border-gray-300 p-2">{{ order.login }}</td>
          <td class="border border-gray-300 p-2">${{ order.totalPrice.toFixed(2) }}</td>
          <td class="border border-gray-300 p-2">
            {{ new Date(order.ordertimestamp).toLocaleString() }}
          </td>
          <td class="border border-gray-300 p-2">
            <select
              v-model="order.orderstatus"
              @change="orderAdminStore.updateOrderStatus(order.orderid, order.orderstatus)"
              class="rounded border p-1"
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </td>
          <td class="border border-gray-300 p-2">
            <ul>
              <li v-for="item in order.items" :key="item.itemname">
                {{ item.itemname }} (x{{ item.quantity }})
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
