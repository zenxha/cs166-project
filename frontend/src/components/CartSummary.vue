<script setup lang="ts">
import { computed } from 'vue';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();

// Prevent invalid inputs
// const validateQuantity = (id: number, event: Event) => {
//   console.log(id)
//   const input = event.target as HTMLInputElement
//   let value = parseInt(input.value, 10)
//   if (isNaN(value) || value < 1) {
//     value = 1
//   }
//   orderStore.updateQuantity(id, value)
// }
</script>

<template>
  <div class="bg-gray-100 p-4 rounded">
    <h2 class="text-lg font-semibold mb-2">Your Order</h2>
    <ul v-if="orderStore.cart.length > 0">
      <li
        v-for="item in orderStore.cart"
        :key="item.id"
        class="flex justify-between items-center border-b py-2"
      >
        <span class="flex-grow">{{ item.itemname }}</span>
        <input
          type="number"
          class="w-16 p-1 text-center border rounded"
          :value="item.quantity"
          @input="orderStore.updateQuantity(item.itemname, item.quantity + 1)"
          min="1"
        />
        <button
          @click="orderStore.removeFromCart(item.id)"
          class="ml-4 text-red-600 hover:underline cursor-pointer"
        >
          Remove
        </button>
      </li>
    </ul>
    <p v-else class="text-gray-500">No items in cart.</p>
    <p class="font-bold mt-2">Total: ${{ orderStore.orderTotal.toFixed(2) }}</p>
  </div>
</template>
