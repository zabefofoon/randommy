<template>
  <ul class="flex flex-col gap-4">
    <li
      v-if="opponent"
      class="text-center text-sm | border-y border-dotted | py-3">
      {{ opponent.sex === 'w' ? $t('w') : $t('m')
      }}{{ $t('matched', [$t(opponent.country || 'US')]) }}
    </li>
    <li
      v-for="(message, index) in messages"
      :key="index"
      class="w-fit max-w-[80%] lg:max-w-[320px]"
      :class="{ 'ml-auto': message.my }">
      <div
        class="text-sm"
        :class="message.my ? 'text-right' : 'text-left'">
        <span v-if="message.my">{{ $t('me') }}</span>
        <span v-else>{{ $t('other') }}</span>
      </div>
      <p
        class="border | rounded-lg | p-1.5 | text-sm break-words"
        :class="message.my ? 'bg-white' : 'bg-slate-200'">
        {{ message.message || '&nbsp;' }}
      </p>
    </li>
    <li
      v-if="messages.length && isChatting"
      class="text-center text-sm text-red-500 font-light">
      {{ $t('hasEndedChat') }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { EnterInfo } from '@/models/EnterInfo'
import { useUserStore } from '@/stores/user.store'

defineProps<{
  messages: { my?: boolean; message: string }[]
  isChatting: boolean
  opponent?: EnterInfo
}>()

const userStore = useUserStore()

if (!userStore.country)
  fetch('https://ipinfo.io/json')
    .then(res => res.json())
    .then(data => userStore.setCountry(data.country))
</script>

<style></style>
