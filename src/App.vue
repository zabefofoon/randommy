<template>
  <div class="flex flex-col | h-[100svh]">
    <Header />
    <main class="h-full | overflow-hidden">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import '@/assets/styles/basic.scss'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<style lang="scss" scoped></style>
