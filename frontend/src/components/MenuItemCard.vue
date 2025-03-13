<script setup lang="ts">
import type { MenuItem } from '@/stores/menu';

defineProps<{ item: MenuItem; buttonLabel?: string; buttonAction?: (item: MenuItem) => void }>();
</script>

<template>
  <div class="rounded bg-white p-4 shadow">
    <h2 class="text-lg font-semibold">{{ item.itemname }}</h2>
    <p class="text-sm text-gray-600">Type: {{ item.typeofitem }}</p>
    <p class="text-md font-bold">${{ item.price.toFixed(2) }}</p>

    <!-- Conditionally show button -->
    <button
      v-if="buttonLabel && buttonAction"
      @click="buttonAction(item)"
      class="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>
