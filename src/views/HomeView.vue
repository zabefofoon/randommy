<template>
  <section class="h-full flex flex-col items-center justify-center lg:p-4">
    <div class="flex flex-col | h-full w-full max-w-[800px] | border">
      <div
        ref="scrollAreaEl"
        class="h-full | flex flex-col gap-8 | p-4 | overflow-auto">
        <Notice />
        <Chat :messages="messages" />
      </div>
      <div class="flex items-center | border-t">
        <button
          class="py-1.5 px-2 flex | border-r"
          @click="pauseChat">
          <i class="icon icon-close"></i>
        </button>
        <input
          ref="inputEl"
          class="w-full | mt-auto | py-1.5 px-2"
          placeholder="텍스트를 입력하세요."
          @keypress.enter="sendMessage($event.target!.value)" />
        <button
          class="py-1.5 px-2 flex | border-l"
          @click="sendMessage(inputEl!.value)">
          <i class="icon icon-arrow-right"></i>
        </button>
      </div>
    </div>
    <ChatStarter
      v-if="isShowPopup"
      :loading="loading"
      @start="startChat"
      @pause="pauseChat" />
  </section>
</template>

<script setup lang="ts">
import Chat from '@/components/Chat.vue'
import ChatStarter from '@/components/ChatStarter.vue'
import Notice from '@/components/Notice.vue'
import type { ConnectSocketToken, EnterInfo } from '@/models/EnterInfo'
import util from '@/utils/util'
import { Socket, io } from 'socket.io-client'
import { ref, toValue } from 'vue'

const inputEl = ref<HTMLInputElement>()
const scrollAreaEl = ref<HTMLDivElement>()
let socket: Socket

const isShowPopup = ref(true)
const showPopup = (value: boolean) => (isShowPopup.value = value)

const loading = ref(false)
const setLoading = (value: boolean) => (loading.value = value)

const messages = ref<{ my?: boolean; message: string }[]>([])

const opponent = ref<EnterInfo>()
const setOpponent = (enterInfo: EnterInfo) => (opponent.value = enterInfo)
const startChat = async () => {
  setLoading(true)
  socket = io(import.meta.env.VITE_REPEATER_URL, {
    transports: ['websocket']
  })

  // 1. 소켓서버에 내 정보를 전송
  socket.on('connect', () => {
    socket.emit('randommy', <EnterInfo>{
      type: 'enter',
      id: socket.id!,
      sex: 'm',
      country: 'korea'
    })
  })

  // 2. 대기중인 다른 사용자와 매칭이 되면 sdp 교환
  socket.on('matched', async (token: ConnectSocketToken) => {
    if (token.sender.id !== socket.id) {
      setOpponent(token.sender)
      showPopup(false)
    } else if (token.receiver.id !== socket.id) {
      setOpponent(token.receiver)
      showPopup(false)
    }
  })

  socket.on('message', (message: string) => messages.value.push({ message }))
  socket.on('close', pauseChat)
}

const pauseChat = () => {
  socket.emit('randommy', {
    type: 'close',
    to: toValue(opponent)?.id
  })
  socket.disconnect()
  socket.close()
  setLoading(false)
  showPopup(true)
}

const sendMessage = async (message: string) => {
  messages.value.push({
    my: true,
    message
  })
  socket.emit('randommy', {
    type: 'messageTo',
    to: toValue(opponent)?.id,
    message
  })
  inputEl.value!.value = ''
  await util.sleep(1)
  scrollAreaEl.value!.scrollTop = 999999999999999
}

window.addEventListener('beforeunload', () => {
  socket.emit('randommy', {
    type: 'close',
    to: toValue(opponent)?.id
  })
})
</script>
