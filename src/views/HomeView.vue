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
  RtcAnswer,
  RtcOffer,
  RtcOfferToken
} from '@/models/EnterInfo'
import util from '@/utils/util'
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

let peerConnection: RTCPeerConnection
let dataChannel: RTCDataChannel

const messages = ref<{ my: boolean; message: string }[]>([])
const opponent = ref<EnterInfo>()
const setOpponent = (info: EnterInfo) => (opponent.value = info)

let timer: NodeJS.Timeout

const startChat = async () => {
  setLoading(true)

  peerConnection = new RTCPeerConnection()
  dataChannel = peerConnection.createDataChannel(`randommy`)

  console.log(import.meta.env.VITE_REPEATER_URL)
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
      await senOfferSDP(socket, token)
      setOpponent(token.receiver)
    }
    // 2.2 Offer SDP를 받으면, 셋팅 후 Answer SDP 전달
    else if (token.receiver.id === socket.id) {
      await sendAnswerSDP(socket)
      setOpponent(token.sender)
    }
  })

  // 3. 전달 받은 Answer SDP 셋팅
  socket.on('receiveRtcAnswer', async (token: RtcOfferToken) => {
    if (token.senderId === socket.id) {
      await peerConnection.setRemoteDescription(token.data)
    }
  })
  const randomTimeout = [10000, 11000, 12000]
  const randomNumber = Math.floor(Math.random() * 3)

  // 채팅 시작
  dataChannel.addEventListener('open', () => {
    setLoading(false)
    showPopup(false)
    socket.disconnect()
    socket.close()
    clearTimeout(timer)
  })

  // 매세지 받을 때
  peerConnection.addEventListener('datachannel', event => {
    const receiveChannel = event.channel

    receiveChannel.onmessage = async event => {
      messages.value.push({
        my: false,
        message: event.data
      })
      await util.sleep(1)
      scrollAreaEl.value!.scrollTop = 999999999999999
    }
  })

  timer = setTimeout(() => {
    if (isShowPopup.value) {
      socket.disconnect()
      socket.close()
      startChat()
    }
  }, randomTimeout[randomNumber])
}

const senOfferSDP = async (socket: Socket, token: ConnectSocketToken) => {
  // offer SDP 셋팅
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  // offer SDP 전달
  peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) return
    socket.emit('enter', <RtcOffer>{
      type: 'rtcOffer',
      data: peerConnection.localDescription,
      senderId: token.sender.id,
      receiverId: token.receiver.id
    })
  })
}

const sendAnswerSDP = async (socket: Socket) => {
  socket.on('receiveRtcOffer', async (token: RtcOfferToken) => {
    if (token.receiverId !== socket.id) return

    // 전달받은 offer SDP 셋팅
    await peerConnection.setRemoteDescription(token.data)
    // Answer SDP 셋팅 후 전달
    const answerSDP = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answerSDP)
    socket.emit('enter', <RtcAnswer>{
      type: 'rtcAnswer',
      data: answerSDP,
      senderId: token.senderId,
      receiverId: token.receiverId
    })
  })
}

const pauseChat = () => {
  socket.disconnect()
  socket.close()
  setLoading(false)
  showPopup(true)
  clearTimeout(timer)
}

const sendMessage = async (message: string) => {
  dataChannel.send(message)
  messages.value.push({
    my: true,
    message
  })
  inputEl.value!.value = ''
  await util.sleep(1)
  scrollAreaEl.value!.scrollTop = 999999999999999
}
</script>
