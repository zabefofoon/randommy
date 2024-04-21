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
        <button class="py-1.5 px-2 flex | border-r">
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
import type {
  ConnectSocketToken,
  EnterInfo,
  RtcOfferToken
} from '@/models/EnterInfo'
import util from '@/utils/util'
import { DataConnection, Peer } from 'peerjs'
import { Socket, io } from 'socket.io-client'
import { ref } from 'vue'

// import util from '@/utils/util'

const inputEl = ref<HTMLInputElement>()
const scrollAreaEl = ref<HTMLDivElement>()
let socket: Socket

const isShowPopup = ref(true)
const showPopup = (value: boolean) => (isShowPopup.value = value)

const loading = ref(false)
const setLoading = (value: boolean) => (loading.value = value)

const messages = ref<{ my: boolean; message: string }[]>([])

let timer: NodeJS.Timeout

let conn: DataConnection
let peer: Peer

console.log(import.meta.env.VITE_REPEATER_HOST)
console.log(import.meta.env.VITE_REPEATER_PORT)
console.log(import.meta.env.VITE_REPEATER_PATH)

const startChat = async () => {
  setLoading(true)

  socket = io(import.meta.env.VITE_REPEATER_URL, {
    transports: ['websocket']
  })

  // 1. 소켓서버에 내 정보를 전송
  socket.on('connect', () => {
    socket.emit('enter', <EnterInfo>{
      type: 'enter',
      id: socket.id!,
      sex: 'm',
      country: 'korea'
    })
  })

  // 2. 대기중인 다른 사용자와 매칭이 되면 sdp 교환
  socket.on('matched', async (token: ConnectSocketToken) => {
    // 2.1 매칭된 다른 사용자에게 Offer SDP 셋팅 후, 전달
    if (token.sender.id === socket.id) {
      console.log('matched: ', token)
      peer = new Peer(token.sender.id, {
        host: import.meta.env.VITE_REPEATER_HOST,
        port: import.meta.env.VITE_REPEATER_PORT,
        path: import.meta.env.VITE_REPEATER_PATH
      })
      peer.on('connection', conn => {
        console.log('connection')
        conn.on('open', () => {
          conn.send(`Hello: ${token.receiver.id}`)
          console.log('opened')
        })
      })
      setTimeout(() => {
        conn = peer.connect(token.receiver.id)
        console.log(conn)
        conn.on('data', data => {
          console.log('data: ', data)
        })
      }, 1000)
    }
    // 2.2 Offer SDP를 받으면, 셋팅 후 Answer SDP 전달
    else if (token.receiver.id === socket.id) {
      console.log('matched: ', token)
      peer = new Peer(token.receiver.id, {
        host: import.meta.env.VITE_REPEATER_HOST,
        port: import.meta.env.VITE_REPEATER_PORT,
        path: import.meta.env.VITE_REPEATER_PATH
      })
      peer.on('connection', conn => {
        console.log('connection')
        conn.on('open', () => {
          conn.send(`Hello: ${token.sender.id}`)
          console.log('opened')
        })
      })
      setTimeout(() => {
        conn = peer.connect(token.sender.id)
        console.log(conn)
        conn.on('data', data => {
          console.log('data: ', data)
        })
      }, 1000)
    }
  })

  // 3. 전달 받은 Answer SDP 셋팅
  socket.on('receiveRtcAnswer', async (token: RtcOfferToken) => {
    if (token.senderId === socket.id) {
      console.log(token.data)
    }
  })
  const randomTimeout = [10000, 11000, 12000]
  const randomNumber = Math.floor(Math.random() * 3)

  timer = setTimeout(() => {
    if (isShowPopup.value) {
      // socket.disconnect()
      // socket.close()
      // startChat()
    }
  }, randomTimeout[randomNumber])
}

const pauseChat = () => {
  socket.disconnect()
  socket.close()
  setLoading(false)
  showPopup(true)
  clearTimeout(timer)
  conn.close()
  peer.destroy()
}

const sendMessage = async (message: string) => {
  messages.value.push({
    my: true,
    message
  })
  inputEl.value!.value = ''
  await util.sleep(1)
  scrollAreaEl.value!.scrollTop = 999999999999999
}
</script>
