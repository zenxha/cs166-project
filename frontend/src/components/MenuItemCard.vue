<script setup lang="ts">
import type { MenuItem } from '@/stores/menu';

defineProps<{ item: MenuItem; buttonLabel?: string; buttonAction?: (item: MenuItem) => void }>();
</script>

<template>
  <div class="bg-white p-4 shadow rounded">
    <h2 class="text-lg font-semibold">{{ item.itemname }}</h2>
    <p class="text-sm text-gray-600">Type: {{ item.typeofitem }}</p>
    <p class="text-md font-bold">${{ item.price.toFixed(2) }}</p>

    <!-- Conditionally show button -->
    <button
      v-if="buttonLabel && buttonAction"
      @click="buttonAction(item)"
      class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>
