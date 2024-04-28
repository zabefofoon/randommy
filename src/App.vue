<template>
  <div class="flex flex-col | h-[100svh] | border-b-4">
    <Header />
    <main class="h-full | overflow-hidden">
      <RouterView />
    </main>
    <Footer />
    <div
      v-if="isIOS"
      class="border-b-[12px] lg:border-b-0"></div>
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/basic.scss'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
</script>

<style lang="scss" scoped></style>
