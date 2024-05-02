<template>
  <section
    class="h-full flex flex-col items-center justify-center"
    :class="darkModeStore.isDarkMode ? 'bg-gray-800' : ''">
    <div
      class="flex flex-col | h-full w-full max-w-[800px] | sm:border-x"
      :class="darkModeStore.isDarkMode ? 'border-gray-500' : ''">
      <div
        ref="scrollAreaEl"
        class="max-h-full | flex flex-col gap-8 | px-3 pb-3 | overflow-auto">
        <div
          v-if="isShowPopup"
          class="text-sm pt-3"
          :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'">
          {{ $t('notice') }}
        </div>
        <Chat
          :messages="messages"
          :is-chatting="isShowPopup"
          :opponent="opponent" />
      </div>
      <div
        class="relative | flex items-center gap-0.5 | border-t | mt-auto"
        :class="darkModeStore.isDarkMode ? 'border-gray-500' : ''">
        <button
          class="py-1.5 px-2 flex | border-r"
          :class="darkModeStore.isDarkMode ? 'text-white border-gray-500' : ''"
          @click="showOverflow(true)"
          v-click-away="() => showOverflow(false)">
          <i class="icon icon-overflow"></i>
          <div
            v-if="isShowOverflow"
            class="flex flex-col items-start | absolute top-0 left-3 -translate-y-full | shadow-md | border rounded-md"
            :class="
              darkModeStore.isDarkMode
                ? 'bg-gray-800 border-gray-500'
                : 'bg-white'
            ">
            <button
              class="py-2 px-4 | text-sm"
              :class="
                darkModeStore.isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-800'
                  : 'text-gray-500 bg-white hover:bg-gray-100'
              "
              @click="pauseChat()">
              {{ $t('pause') }}
            </button>
            <div
              class="border-t min-w-full"
              :class="darkModeStore.isDarkMode ? 'border-gray-500' : ''"></div>
            <button
              class="py-2 px-4 | text-sm"
              :class="
                darkModeStore.isDarkMode
                  ? ' text-white hover:bg-gray-800'
                  : 'text-gray-500 bg-white hover:bg-gray-100'
              "
              @click="startChat()">
              {{ $t('start') }}
            </button>
          </div>
        </button>
        <input
          ref="inputEl"
          class="w-full | mt-auto | py-2 px-2 | bg-transparent"
          :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'"
          :placeholder="$t('writeText')"
          :readonly="isShowPopup"
          @focus="scollToBottom"
          @keypress.enter="sendMessage($event.target!.value)" />
        <button
          class="py-1.5 px-2 flex | border-l"
          :class="darkModeStore.isDarkMode ? 'text-white border-gray-500' : ''"
          @click="sendMessage(inputEl!.value)">
          <i class="icon icon-arrow-right"></i>
        </button>
      </div>
    </div>
    <ChatStarter
      v-if="isShowPopup"
      :loading="loading"
      @start="startChat"
      @pause="pauseChat()" />
  </section>
</template>

<script setup lang="ts">
import Chat from '@/components/Chat.vue'
import ChatStarter from '@/components/ChatStarter.vue'
import type { ConnectSocketToken, EnterInfo } from '@/models/EnterInfo'
import { useDarkModeStore } from '@/stores/darkMode.store'
import { useUserStore } from '@/stores/user.store'
import util from '@/utils/util'
import { Socket, io } from 'socket.io-client'
import { ref, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { directive as vClickAway } from 'vue3-click-away'

const i18n = useI18n()
const userStore = useUserStore()
const darkModeStore = useDarkModeStore()

const inputEl = ref<HTMLInputElement>()
const scrollAreaEl = ref<HTMLDivElement>()
let socket: Socket

const isShowPopup = ref(true)
const showPopup = (value: boolean) => (isShowPopup.value = value)

const loading = ref(false)
const setLoading = (value: boolean) => (loading.value = value)

const messages = ref<{ my?: boolean; message: string }[]>([])
const addMessage = async (message: { my?: boolean; message: string }) => {
  messages.value.push(message)
  scollToBottom()
}
const opponent = ref<EnterInfo>()
const setOpponent = (enterInfo: EnterInfo) => {
  opponent.value = enterInfo
  messages.value = []
}
const startChat = async () => {
  if (toValue(loading)) return

  if (window.Notification) {
    try {
      Notification.requestPermission()
    } catch (e) {
      console.error(e)
    }
  }

  showOverflow(false)
  setLoading(true)
  socket = io(import.meta.env.VITE_REPEATER_URL, {
    transports: ['websocket']
  })

  // 1. 소켓서버에 내 정보를 전송
  socket.on('connect', () => {
    socket.emit('randommy', <EnterInfo>{
      type: 'enter',
      id: socket.id!,
      sex: userStore.sex,
      country: userStore.country
    })
  })

  // 2. 대기중인 다른 사용자와 매칭이 되면 sdp 교환
  socket.on('matched', async (token: ConnectSocketToken) => {
    if (token.sender.id !== socket.id) {
      setOpponent(token.sender)
      showPopup(false)
      if (inputEl.value) inputEl.value.value = ''
    } else if (token.receiver.id !== socket.id) {
      setOpponent(token.receiver)
      showPopup(false)
      if (inputEl.value) inputEl.value.value = ''
    }

    if (
      document.hidden &&
      window.Notification &&
      Notification.permission === 'granted'
    ) {
      const message = `${
        opponent.value?.sex === 'w' ? i18n.t('w') : i18n.t('m')
      }${i18n.t('matched', [i18n.t(opponent.value?.country || 'US')])}`

      new Notification('RANDOMMY!', {
        body: message
      })
    }
  })

  socket.on('message', (message: string) => {
    addMessage({
      message
    })

    if (
      document.hidden &&
      window.Notification &&
      Notification.permission === 'granted'
    )
      new Notification('RANDOMMY!', {
        body: `${i18n.t('other')}: ${message}`
      })
  })

  socket.on('close', () => pauseChat(false))
}

const pauseChat = async (enableEmit = true) => {
  if (enableEmit)
    socket.emit('randommy', {
      type: 'close',
      to: toValue(opponent)?.id
    })
  await util.sleep(100)
  socket.disconnect()
  socket.close()
  setLoading(false)
  showPopup(true)
  showOverflow(false)
}

const sendMessage = async (message: string) => {
  socket.emit('randommy', {
    type: 'messageTo',
    to: toValue(opponent)?.id,
    message
  })

  if (inputEl.value) {
    inputEl.value.value = ''
    inputEl.value.focus()
  }

  addMessage({
    my: true,
    message
  })
}

const isShowOverflow = ref(false)
const showOverflow = (value: boolean) => (isShowOverflow.value = value)

window.addEventListener('beforeunload', () => {
  socket.emit('randommy', {
    type: 'close',
    to: toValue(opponent)?.id,
    from: socket.id
  })
})

const scollToBottom = async () => {
  await util.sleep(100)
  scrollAreaEl.value!.scrollTo({ top: 9999999999999 })
}
</script>
