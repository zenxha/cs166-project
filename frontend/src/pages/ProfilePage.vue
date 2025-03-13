<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useOrderHistoryStore } from '@/stores/orderHistory';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const userStore = useUserStore();
const orderHistoryStore = useOrderHistoryStore();

const phoneNum = ref('');
const favoriteItem = ref('');
const updateMessage = ref<string | null>(null);

onMounted(async () => {
  phoneNum.value = '';
  favoriteItem.value = '';

  await userStore.fetchProfile();
  if (userStore.profile) {
    phoneNum.value = userStore.profile.phoneNum;
    favoriteItem.value = userStore.profile.favoriteItem;
    orderHistoryStore.username = authStore.username;
    await orderHistoryStore.fetchOrderHistory();
  }
});

const updateProfile = async () => {
  // Prevent toctou attack
  const currentUser = authStore.username;
  await userStore.updateProfile(phoneNum.value, favoriteItem.value);

  // Ensure update applies to the same user
  if (authStore.username === currentUser) {
    updateMessage.value = 'Profile updated successfully!';
  } else {
    updateMessage.value = null; // Clear if user changed mid-update
  }
};

watch([() => orderHistoryStore.perPage, () => orderHistoryStore.currentPage], async () => {
  console.log('Changed');
  console.log(orderHistoryStore.orders);
  console.log(orderHistoryStore.username);
  await orderHistoryStore.fetchOrderHistory();
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Profile</h1>

    <div v-if="userStore.profile" class="mb-6 rounded bg-white p-6 shadow-md">
      <p><strong>Login:</strong> {{ authStore.username }}</p>
      <p><strong>Email:</strong> {{ userStore.profile.email }}</p>

      <!-- Editable Fields -->
      <div class="mt-4">
        <label class="block font-semibold">Phone Number:</label>
        <input v-model="phoneNum" type="text" class="w-full rounded border p-2" />

        <label class="mt-2 block font-semibold">Favorite Item:</label>
        <input v-model="favoriteItem" type="text" class="w-full rounded border p-2" />
      </div>

      <!-- Update Profile Button -->
      <button @click="updateProfile" class="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white">
        Update Profile
      </button>

      <!-- Confirmation Message -->
      <p v-if="updateMessage" class="mt-2 text-green-600">{{ updateMessage }}</p>
    </div>

    <h1 class="mb-4 text-2xl font-bold">Order History</h1>
    <!-- Pagination Controls -->
    <div class="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
      <div class="flex items-center space-x-3">
        <span class="font-semibold text-gray-700">Show:</span>
        <select
          v-model="orderHistoryStore.perPage"
          class="rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-400 focus:ring focus:outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
        </select>
      </div>

      <!-- Pagination Navigation -->
      <div class="flex items-center space-x-4">
        <button
          @click="orderHistoryStore.currentPage = Math.max(1, orderHistoryStore.currentPage - 1)"
          :disabled="orderHistoryStore.currentPage === 1"
          class="rounded-md bg-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <span class="font-semibold text-gray-700">
          Page {{ orderHistoryStore.currentPage }} of {{ orderHistoryStore.totalPages }}
        </span>
        <button
          @click="
            orderHistoryStore.currentPage = Math.min(
              orderHistoryStore.totalPages,
              orderHistoryStore.currentPage + 1,
            )
          "
          :disabled="orderHistoryStore.currentPage >= orderHistoryStore.totalPages"
          class="rounded-md bg-gray-200 px-4 py-2 text-gray-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Order Table -->
    <table class="w-full border-collapse overflow-hidden rounded-lg shadow-md">
      <thead>
        <tr class="bg-blue-500 text-left text-white">
          <th class="border border-gray-300 p-3">Order ID</th>
          <th class="border border-gray-300 p-3">Total Price</th>
          <th class="border border-gray-300 p-3">Date</th>
          <th class="border border-gray-300 p-3">Status</th>
          <th class="border border-gray-300 p-3">Items</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orderHistoryStore.orders"
          :key="order.orderid"
          class="transition odd:bg-gray-100 hover:bg-gray-200"
        >
          <td class="border border-gray-300 p-3">{{ order.orderid }}</td>
          <td class="border border-gray-300 p-3 font-semibold text-green-600">
            ${{ order.totalprice.toFixed(2) }}
          </td>
          <td class="border border-gray-300 p-3">
            {{ new Date(order.ordertimestamp).toLocaleString() }}
          </td>
          <td class="border border-gray-300 p-3 font-medium text-blue-700">
            {{ order.orderstatus.trim() }}
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
</template>
