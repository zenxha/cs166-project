<script setup lang="ts">
// import { computed } from 'vue';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
</script>

<template>
  <div class="rounded bg-gray-100 p-4">
    <h2 class="mb-2 text-lg font-semibold">Your Order</h2>
    <ul v-if="orderStore.cart.length > 0">
      <li
        v-for="item in orderStore.cart"
        :key="item.id"
        class="flex items-center justify-between border-b py-2"
      >
        <span class="flex-grow">{{ item.itemname }}</span>
        <input
          type="number"
          class="w-16 rounded border p-1 text-center"
          :value="item.quantity"
          @input="
            (event) => orderStore.updateQuantity(item.itemname, parseInt(event.target.value) || 1)
          "
          min="1"
        />
        <button
          @click="orderStore.removeFromCart(item.itemname)"
          class="ml-4 cursor-pointer text-red-600 hover:underline"
        >
          Remove
        </button>
      </li>
    </ul>
    <p v-else class="text-gray-500">No items in cart.</p>
    <p class="mt-2 font-bold">Total: ${{ orderStore.orderTotal.toFixed(2) }}</p>
  </div>
</template>
