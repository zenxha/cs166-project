<script setup lang="ts"></script>

<template>
  <div class="flex h-screen flex-col bg-gray-100">
    <NavBar />
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
</script>
