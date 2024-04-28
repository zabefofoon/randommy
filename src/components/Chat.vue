<template>
  <ul class="flex flex-col gap-6">
    <li
      v-for="(message, index) in messages"
      :key="index"
      class="max-w-[80%] lg:max-w-[320px]"
      :class="{ 'ml-auto': message.my }">
      <div
        class="text-sm"
        :class="message.my ? 'text-right' : 'text-left'">
        <span v-if="message.my">me</span>
        <span v-else>other(korea)</span>
      </div>
      <p
        class="border | rounded-lg | p-1.5 | text-sm"
        :class="message.my ? 'bg-white' : 'bg-slate-200'">
        {{ message.message }}
      </p>
    </li>
    <li
      v-if="messages.length && isChatting"
      class="text-center text-sm text-red-500 font-light">
      채팅이 종료되었습니다.
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  messages: { my?: boolean; message: string }[]
  isChatting: boolean
}>()
</script>

<style></style>
