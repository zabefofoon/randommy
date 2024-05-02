<template>
  <header
    class="border-b | py-1.5 px-4 | flex"
    :class="
      darkModeStore.isDarkMode ? 'bg-gray-800 border-gray-500' : 'bg-white'
    ">
    <a href="#">
      <div class="flex gap-2">
        <img
          class="w-[24px] rounded-full"
          src="@/assets/images/logo.svg" />
        <span
          class="font-extrabold"
          :class="darkModeStore.isDarkMode ? 'text-white' : ''">
          RANDOMMY
        </span>
      </div>
    </a>
    <button
      class="ml-auto px-1 rounded-full | flex items-center justify-center"
      :class="
        darkModeStore.isDarkMode
          ? 'bg-white text-gray-800'
          : 'bg-slate-700 text-white'
      "
      @click="darkModeStore.toggleDarkMode()">
      <i class="icon icon-dark-mode"></i>
    </button>
  </header>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '@/stores/darkMode.store'

const darkModeStore = useDarkModeStore()
</script>

<style></style>
