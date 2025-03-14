<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { User } from '@/stores/admin';

const props = defineProps<{
  user: User | null;
  field: 'login' | 'phoneNum';
  isOpen: boolean;
}>();
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

const fieldLabel = computed(() => {
  const labels: Record<string, string> = {
    login: 'Login',
    phoneNum: 'Phone Number',
  };
  return labels[props.field] || 'Unknown';
});

const saveChanges = () => {
  if (props.user) {
    emit('updateUser', props.user.login, { [props.field]: inputValue.value });
    emit('close');
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-lg font-bold">Edit {{ fieldLabel }}</h2>
      <input
        v-model="inputValue"
        :type="field === 'phoneNum' ? 'tel' : 'text'"
        class="w-full rounded border p-2"
      />
      <div class="mt-4 flex justify-end space-x-2">
        <button @click="emit('close')" class="rounded bg-gray-300 px-4 py-2">Cancel</button>
        <button @click="saveChanges" class="rounded bg-blue-500 px-4 py-2 text-white">Save</button>
      </div>
    </div>
  </div>
</template>
