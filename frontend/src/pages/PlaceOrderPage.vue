<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { useOrderStore } from '@/stores/order';

import MenuItemCard from '@/components/MenuItemCard.vue';

const menuStore = useMenuStore();
const orderStore = useOrderStore();
const orderMessage = ref<string | null>(null);

onMounted(() => {
  menuStore.fetchMenu();
  orderStore.fetchStores();
});

const handleOrder = async () => {
  const result = await orderStore.placeOrder();
  orderMessage.value = result.message;
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Place Your Order</h1>

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
    <h2 class="text-lg font-semibold mt-6">Your Order</h2>
    <ul class="mt-2">
      <li v-for="item in orderStore.cart" :key="item.id" class="flex justify-between bg-gray-100 p-2 rounded mb-2">
        <span>{{ item.name }} (x{{ item.quantity }})</span>
        <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
      </li>
    </ul>
    <p class="font-bold">Total: ${{ orderStore.orderTotal.toFixed(2) }}</p>

    <!-- Place Order Button -->
    <button @click="handleOrder" class="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full">
      Place Order
    </button>

    <!-- Order Confirmation -->
    <p v-if="orderMessage" class="mt-2 text-center text-lg font-semibold text-green-600">{{ orderMessage }}</p>
  </div>
</template>
