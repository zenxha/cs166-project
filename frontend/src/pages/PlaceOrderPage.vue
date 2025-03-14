<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { useOrderStore } from '@/stores/order';
import { useAuthStore } from '@/stores/auth';

import MenuItemCard from '@/components/MenuItemCard.vue';
import CartSummary from '@/components/CartSummary.vue';

const menuStore = useMenuStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const orderMessage = ref<string | null>(null);
const messageType = ref<'success' | 'error' | null>(null);

onMounted(() => {
  menuStore.fetchMenu();
  orderStore.fetchStores();
});

const handleOrder = async () => {
  if (!authStore.isAuthenticated) {
    orderMessage.value = 'You must be logged in to place an order.';
    messageType.value = 'error';
    return;
  }

  const result = await orderStore.placeOrder();
  messageType.value = result.success ? 'success' : 'error';
  orderMessage.value = result.message;
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Place Your Order</h1>

    <!-- Show warning if user is not logged in -->
    <p v-if="!authStore.isAuthenticated" class="mb-4 font-semibold text-red-500">
      You must be logged in to place an order.
      <router-link to="/login" class="underline">Login here</router-link>
    </p>

    <!-- Store Selection -->
    <label class="block font-semibold">Select Store:</label>
    <select v-model="orderStore.selectedStore" class="mb-4 w-full rounded border p-2">
      <option v-for="store in orderStore.stores" :key="store.storeid" :value="store">
        {{ store.address }}, {{ store.city }}, {{ store.state }} ({{ store.isOpen === 'yes' ? 'Open' : 'Closed' }})
      </option>
    </select>

    <!-- Menu Items -->
    <h2 class="mb-2 text-lg font-semibold">Menu Items:</h2>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MenuItemCard
        v-for="item in menuStore.items"
        :key="item.id"
        :item="item"
        buttonLabel="Add to Order"
        :buttonAction="orderStore.addToCart"
      />
    </div>

    <!-- Cart Summary -->
    <CartSummary class="mt-6" />

    <!-- Place Order Button -->
    <button
      @click="handleOrder"
      :disabled="!authStore.isAuthenticated"
      class="mt-4 w-full cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
    >
      Place Order
    </button>

    <!-- Order Confirmation -->
    <p
      v-if="orderMessage"
      class="mt-2 text-center text-lg font-semibold"
      :class="messageType === 'error' ? 'text-red-500' : 'text-green-500'"
    >
      {{ orderMessage }}
    </p>
  </div>
</template>
