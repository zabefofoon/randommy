<template>
  <section class="h-full flex flex-col items-center justify-center lg:p-4">
    <div class="flex flex-col | h-full w-full max-w-[800px] | border">
      <div class="h-full | flex flex-col gap-8 | p-4 | overflow-auto">
        <Notice />
        <Chat />
      </div>
      <div class="flex items-center | border-t">
        <button class="py-1.5 px-2 flex | border-r">
          <i class="icon icon-close"></i>
        </button>
        <input
          class="w-full | mt-auto | py-1.5 px-2"
          placeholder="텍스트를 입력하세요." />
        <button class="py-1.5 px-2 flex | border-l">
          <i class="icon icon-arrow-right"></i>
        </button>
      </div>
    </div>
    <ChatStarter
      v-if="isShowPopup"
      :loading="loading"
      @start="startChat" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Notice from '@/components/Notice.vue'
import Chat from '@/components/Chat.vue'
import ChatStarter from '@/components/ChatStarter.vue'
import util from '@/utils/util'

const isShowPopup = ref(true)
const showPopup = (value: boolean) => (isShowPopup.value = value)

const loading = ref(false)
const setLoading = (value: boolean) => (loading.value = value)

const startChat = async () => {
  setLoading(true)
  await util.sleep()
  setLoading(false)
  showPopup(false)
}
</script>
