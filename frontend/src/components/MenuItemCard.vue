<script setup lang="ts">
import type { MenuItem } from '@/stores/menu'

defineProps<{ item: MenuItem }>()
</script>

<template>
  <div class="bg-white p-4 shadow rounded">
    <h2 class="text-lg font-semibold">{{ item.name }}</h2>
    <p class="text-sm text-gray-600">Type: {{ item.type }}</p>
    <p class="text-md font-bold">${{ item.price.toFixed(2) }}</p>
  </div>
</template>
