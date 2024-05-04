<template>
  <footer
    class="border-t | hidden sm:flex gap-2 | px-4 py-0.5"
    :class="
      darkModeStore.isDarkMode ? 'bg-gray-800 border-gray-500' : 'bg-white'
    ">
    <span
      class="text-sm | font-light"
      :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'">
      Try 'randommy,' the convenient web app for random chatting. Engage with
      new people on various topics and interests.
    </span>
    <button
      class="text-sm underline"
      :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'"
      @click="router.push({ query: { desc: 'true' } })">
      more...
    </button>
    <span
      class="text-sm | ml-auto"
      :class="darkModeStore.isDarkMode ? 'text-white' : 'text-gray-500'">
      RANDOMMY
    </span>
  </footer>
  <Transition>
    <div
      v-show="isShowDescription"
      class="page-description | fixed bottom-0 left-0 | bg-white border-t | w-full rounded-t-xl | pt-8 px-4 pb-4">
      <button
        class="absolute right-4 top-1.5"
        @click="router.replace({ query: {} })">
        <i class="icon icon-close"></i>
      </button>
      <div
        class="flex flex-col gap-4 | mx-auto | sm:w-1/2 max-h-[50vh] overflow-auto | text-sm">
        <h2>
          "Random Chatting with Randommy: Embrace Serendipitous Connections!"
        </h2>
        <h2>
          Random chatting has become one of the emerging social platforms in
          modern society. Random chatting refers to real-time chatting between
          strangers from anywhere in the world via the internet. One of the
          prominent examples of such platforms is Randommy.
        </h2>
        <p>
          As the name suggests, Randommy provides users with the opportunity to
          chat with random people. Here, users can connect with individuals of
          diverse nationalities, cultures, and interests, often leading to
          unexpected encounters and conversations.
        </p>
        <p>
          Random chatting goes beyond merely making new friends or understanding
          different cultures. Sometimes, it can lead to unexpected friendships
          or even romances. Additionally, these platforms can enhance social
          connectivity among users.
        </p>
        <p>
          These social platforms prioritize anonymity and privacy, ensuring
          users can chat safely. Therefore, users can enjoy chatting at their
          comfort level, while making new experiences and connections.
        </p>
        <p>
          Through random chatting, users can connect with people from around the
          world, fostering diverse and enriching relationships. That's precisely
          the value Randommy aims to deliver.
        </p>
        <hr />
        <h2>"랜덤채팅, Randommy: 우연의 인연을 만나다!"</h2>
        <h2>
          랜덤채팅은 현대 사회에서 새롭게 떠오르고 있는 소셜 플랫폼 중
          하나입니다. 여기서 랜덤채팅이란, 전 세계 어디서든 인터넷을 통해 서로
          모르는 사람들끼리 실시간으로 채팅하는 것을 의미합니다. 이러한 플랫폼의
          대표적인 예시로는 Randommy가 있습니다.
        </h2>
        <p>
          Randommy는 그 이름에서도 알 수 있듯이 랜덤한 사람들과의 채팅을 즐길 수
          있는 플랫폼입니다. 여기서 사용자는 다양한 국적, 문화, 관심사를 가진
          사람들과 연결될 수 있습니다. 이는 때로는 예상치 못한 만남과 이야기를
          경험할 수 있음을 의미합니다.
        </p>
        <p>
          랜덤채팅은 단순히 새로운 친구를 만들거나, 다른 문화를 이해하는 것에
          그치지 않습니다. 때로는 뜻밖의 우정이나 로맨스까지 이어질 수 있습니다.
          또한, 이러한 플랫폼은 사회적인 연결성을 증진시키는 데 도움을 줄 수
          있습니다.
        </p>
        <p>
          이러한 소셜 플랫폼은 사용자들에게 익명성과 개인 정보 보호를
          중요시하며, 사용자들이 안전하게 채팅을 즐길 수 있도록 노력하고
          있습니다. 따라서 사용자들은 자신의 편안한 수준에서 채팅을 즐기며,
          새로운 경험과 인연을 만들어갈 수 있습니다.
        </p>
        <p>
          랜덤채팅을 통해 세계 어디서든 사람들과 연결되어 보다 다양하고 풍부한
          인간관계를 형성할 수 있는 기회를 제공받을 수 있습니다. 그리고 그것이
          바로 Randommy가 지향하는 가치입니다.
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '@/stores/darkMode.store'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const darkModeStore = useDarkModeStore()
const isShowDescription = ref(false)
const showDescription = (value: boolean) => (isShowDescription.value = value)

watch(
  () => route.query.desc,
  desc => {
    showDescription(!!desc)
  }
)
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: transform 300ms ease;
}

.v-enter-from,
.v-leave-to {
  transform: translate(0, 100%);
}
</style>
