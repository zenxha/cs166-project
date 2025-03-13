<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import type { User } from '@/stores/admin';

const props = defineProps<{ user: User | null; field: 'name' | 'email'; isOpen: boolean }>();
const emit = defineEmits(['updateUser', 'close']);

const inputValue = ref('');

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      inputValue.value = newUser[props.field];
    }
  },
  { immediate: true },
);

const saveChanges = () => {
  if (props.user) {
    emit('updateUser', props.user.id, { [props.field]: inputValue.value });
    emit('close');
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-lg font-bold">Edit {{ field === 'login' ? 'Login' : 'Email' }}</h2>
      <input v-model="inputValue" type="text" class="w-full rounded border p-2" />
      <div class="mt-4 flex justify-end space-x-2">
        <button @click="emit('close')" class="rounded bg-gray-300 px-4 py-2">Cancel</button>
        <button @click="saveChanges" class="rounded bg-blue-500 px-4 py-2 text-white">Save</button>
      </div>
    </div>
  </div>
</template>
