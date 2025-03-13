<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import type { MenuItem } from '@/stores/menuAdmin';

const props = defineProps<{ menuItem: MenuItem | null; isOpen: boolean }>();
const emit = defineEmits(['updateItem', 'close']);

const form = ref<MenuItem>({
  itemname: '',
  ingredients: '',
  typeofitem: '',
  price: 0,
  description: '',
});

watch(
  () => props.menuItem,
  (newItem) => {
    if (newItem) {
      form.value = { ...newItem };
    }
  },
  { immediate: true },
);

const saveChanges = () => {
  if (props.menuItem) {
    emit('updateItem', props.menuItem.itemname, form.value);
    emit('close');
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-lg font-bold">Edit Menu Item</h2>
      <input
        v-model="form.itemname"
        type="text"
        placeholder="Item Name"
        class="mb-2 w-full rounded border bg-gray-100 p-2"
      />
      <input
        v-model="form.ingredients"
        type="text"
        placeholder="Ingredients"
        class="mb-2 w-full rounded border p-2"
      />
      <input
        v-model="form.typeofitem"
        type="text"
        placeholder="Category"
        class="mb-2 w-full rounded border p-2"
      />
      <input
        v-model="form.price"
        type="number"
        placeholder="Price"
        class="mb-2 w-full rounded border p-2"
      />
      <textarea
        v-model="form.description"
        placeholder="Description"
        class="mb-2 w-full rounded border p-2"
      ></textarea>
      <div class="flex justify-end space-x-2">
        <button @click="emit('close')" class="rounded bg-gray-300 px-4 py-2">Cancel</button>
        <button @click="saveChanges" class="rounded bg-blue-500 px-4 py-2 text-white">Save</button>
      </div>
    </div>
  </div>
</template>
