<template>
  <footer
    class="border-t | hidden sm:flex gap-2 | px-4 py-0.5"
    :class="
      darkModeStore.isDarkMode ? 'bg-gray-800 border-gray-500' : 'bg-white'
    ">
    <span
      class="text-sm | font-light"
      :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'">
      Try 'randommy,' the convenient web app for random chatting. Engage with
      new people on various topics and interests.
    </span>
    <span
      class="text-sm | ml-auto"
      :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'"
      >RANDOMMY</span
    >
  </footer>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '@/stores/darkMode.store'

const darkModeStore = useDarkModeStore()
</script>

<style></style>
