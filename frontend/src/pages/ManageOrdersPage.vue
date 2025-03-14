<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useOrderAdminStore } from '@/stores/orderAdmin';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const orderAdminStore = useOrderAdminStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  orderAdminStore.fetchOrders();
});

watch([() => orderAdminStore.perPage, () => orderAdminStore.currentPage], async () => {
  console.log('Changed');
  console.log(orderAdminStore.orders);
  console.log(authStore.username);
  await orderAdminStore.fetchOrders();
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Manage Orders</h1>

    <div v-if="authStore.isAdmin" class="mb-4 flex space-x-4">
      <button
        @click="router.push('/manage/menu')"
        class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Manage Menu
      </button>
      <button
        @click="router.push('/manage/users')"
        class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Manage Users
      </button>
    </div>

    <!-- Search & Sort Controls -->
    <div
      class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md"
    >
      <input
        v-model="orderAdminStore.searchLogin"
        type="text"
        placeholder="Search by user..."
        class="w-1/3 rounded-lg border border-gray-300 p-2 focus:ring focus:ring-blue-300"
      />

      <div class="flex items-center space-x-3">
        <span class="font-medium text-gray-700">Sort By:</span>
        <select
          v-model="orderAdminStore.sortField"
          class="rounded-lg border border-gray-300 p-2 focus:ring focus:ring-blue-300"
        >
          <option :value="null">Sort By</option>
          <option value="ordertimestamp">Date</option>
          <option value="totalprice">Total Price</option>
          <option value="orderstatus">Status</option>
        </select>
      </div>

      <div class="flex items-center space-x-3">
        <span class="font-medium text-gray-700">Order:</span>
        <select
          v-model="orderAdminStore.sortOrder"
          class="rounded-lg border border-gray-300 p-2 focus:ring focus:ring-blue-300"
        >
          <option :value="null">Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
      <div class="flex items-center space-x-3">
        <span class="font-semibold text-gray-700">Show:</span>
        <select
          v-model="orderAdminStore.perPage"
          @change="orderAdminStore.currentPage = 1"
          class="rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-400 focus:ring focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
        </select>
        <span class="font-semibold text-gray-700">orders per page</span>
      </div>

      <!-- Pagination Navigation -->
      <div class="flex items-center space-x-4">
        <button
          @click="orderAdminStore.currentPage = Math.max(1, orderAdminStore.currentPage - 1)"
          :disabled="orderAdminStore.currentPage === 1"
          class="rounded-lg bg-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <span class="font-semibold text-gray-700">
          Page {{ orderAdminStore.currentPage }} of {{ orderAdminStore.totalPages }}
        </span>
        <button
          @click="
            orderAdminStore.currentPage = Math.min(
              orderAdminStore.totalPages,
              orderAdminStore.currentPage + 1,
            )
          "
          :disabled="orderAdminStore.currentPage >= orderAdminStore.totalPages"
          class="rounded-lg bg-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse overflow-hidden rounded-lg shadow-lg">
        <thead>
          <tr class="bg-blue-500 text-left text-white">
            <th class="border border-gray-300 p-3">Order ID</th>
            <th class="border border-gray-300 p-3">User</th>
            <th class="border border-gray-300 p-3">Total</th>
            <th class="border border-gray-300 p-3">Date</th>
            <th class="border border-gray-300 p-3">Status</th>
            <th class="border border-gray-300 p-3">Items</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orderAdminStore.filteredOrders"
            :key="order.orderid"
            class="transition hover:bg-gray-200"
          >
            <td class="border border-gray-300 p-3">{{ order.orderid }}</td>
            <td class="border border-gray-300 p-3">{{ order.login }}</td>
            <td class="border border-gray-300 p-3 font-semibold text-green-600">
              ${{ order.totalprice.toFixed(2) }}
            </td>
            <td class="border border-gray-300 p-3">
              {{ new Date(order.ordertimestamp).toLocaleString() }}
            </td>
            <td class="border border-gray-300 p-3">
              <select
                v-model="order.orderstatus"
                @change="
                  orderAdminStore.updateOrderStatus(
                    order.orderid,
                    order.orderstatus.trim() as 'complete' | 'incomplete',
                  )
                "
                class="rounded-lg border border-gray-300 bg-white p-2 shadow-sm focus:ring focus:ring-blue-300"
              >
                <option value="incomplete">Incomplete</option>
                <option value="complete">Complete</option>
              </select>
            </td>
            <td class="border border-gray-300 p-3">
              <ul class="list-disc pl-4">
                <li v-for="item in order.items" :key="item.itemname">
                  {{ item.itemname }} (x{{ item.quantity }})
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
