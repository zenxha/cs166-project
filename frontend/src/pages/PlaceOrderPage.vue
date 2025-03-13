<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { useOrderStore } from '@/stores/order';
import { useAuthStore } from '@/stores/auth'

import MenuItemCard from '@/components/MenuItemCard.vue';
import CartSummary from '@/components/CartSummary.vue';

const menuStore = useMenuStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const orderMessage = ref<string | null>(null);

onMounted(() => {
  menuStore.fetchMenu();
  orderStore.fetchStores();
});

const handleOrder = async () => {
  if (!authStore.isAuthenticated) {
    orderMessage.value = 'You must be logged in to place an order.';
    return;
  }

  const result = await orderStore.placeOrder();
  orderMessage.value = result.message;
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Place Your Order</h1>

    <!-- Show warning if user is not logged in -->
    <p v-if="!authStore.isAuthenticated" class="text-red-500 font-semibold mb-4">
      You must be logged in to place an order. <router-link to="/login" class="underline">Login here</router-link>
    </p>

    <!-- Store Selection -->
    <label class="block font-semibold">Select Store:</label>
    <select v-model="orderStore.selectedStore" class="p-2 border rounded mb-4 w-full">
      <option v-for="store in orderStore.stores" :key="store.id" :value="store">
        {{ store.name }} ({{ store.isOpen ? 'Open' : 'Closed' }})
      </option>
    </select>

    <!-- Menu Items -->
    <h2 class="text-lg font-semibold mb-2">Menu Items:</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    class="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full">
      Place Order
    </button>

    <!-- Order Confirmation -->
    <p v-if="orderMessage" class="mt-2 text-center text-lg font-semibold text-green-600">{{ orderMessage }}</p>
  </div>
</template>
