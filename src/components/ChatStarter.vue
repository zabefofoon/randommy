<template>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 | flex flex-col items-center justify-center">
    <div class="shadow-lg">
      <div class="w-[240px] aspect-square bg-slate-100 | rounded-t-lg"></div>
      <button
        class="w-full | border rounded-b-lg | px-8 py-1.5 | bg-slate-500 | text-white"
        @click="emit('start')">
        <Loader v-if="loading" />
        <span
          v-else
          class="text-sm">
          채팅 시작하기
        </span>
      </button>
    </div>
    <span
      v-if="false"
      class="mt-2 | text-sm text-gray-500">
      100명 대기중
    </span>
  </div>
</template>

<script setup lang="ts">
import Loader from '@/components/Loader.vue'

defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
}>()
</script>

<style></style>
