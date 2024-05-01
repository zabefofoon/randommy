<template>
  <div
    class="flex flex-col | h-[100svh] | border-b-4"
    :class="darkModeStore.isDarkMode ? 'border-gray-800' : ''">
    <Header />
    <main class="h-full | overflow-hidden">
      <RouterView />
    </main>
    <Footer />
    <div
      v-if="isIOS"
      class="border-b-[8px] sm:border-b-0"
      :class="darkModeStore.isDarkMode ? 'border-gray-800' : ''"></div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/basic.scss'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useDarkModeStore } from './stores/darkMode.store'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

const darkModeStore = useDarkModeStore()
</script>

<style lang="scss" scoped></style>
