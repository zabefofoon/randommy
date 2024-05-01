<template>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 | flex flex-col items-center justify-center"
    v-show="!isHidePopup">
    <div class="relative shadow-lg">
      <button
        @click="hidePopup(true)"
        class="absolute top-1 left-1 | bg-white rounded-full | flex">
        <i class="icon icon-close | text-xs"></i>
      </button>
      <div class="w-[240px] aspect-square bg-transparent | rounded-t-lg">
        <iframe
          width="240"
          height="240"
          allowtransparency="true"
          src="https://tab2.clickmon.co.kr/pop/wp_ad_250.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1138899%7C%5E%7CAdver_M_1046207&mon_rf=REFERRER_URL&mon_direct_url=URLENCODE_PASSBACK_INPUT"
          frameborder="0"
          scrolling="no"></iframe>
      </div>
      <div
        class="flex"
        :class="darkModeStore.isDarkMode ? '' : 'border-x border-gray-300'">
        <select
          v-model="userStore.sex"
          class="text-sm | border-r | w-full | px-2 py-1"
          :class="
            darkModeStore.isDarkMode
              ? 'bg-gray-800 text-white border-l border-gray-500'
              : 'bg-white border-gray-300'
          ">
          <option value="m">{{ $t('m') }}</option>
          <option value="w">{{ $t('w') }}</option>
        </select>
        <select
          v-model="userStore.country"
          class="text-sm | w-[140px] truncate overflow-hidden | p-1"
          :class="
            darkModeStore.isDarkMode
              ? 'bg-gray-800 text-white border-r border-gray-500'
              : 'bg-white border-gray-300'
          ">
          <option
            v-for="country in userStore.allCountries"
            :value="country.code">
            {{ $t(`${country.code}`) }}({{ country.code }})
          </option>
        </select>
      </div>
      <button
        class="w-full | border rounded-b-lg | px-8 py-1.5"
        :class="
          darkModeStore.isDarkMode
            ? 'bg-gray-600 text-white border-gray-600'
            : 'bg-gray-800 | text-white'
        "
        @click="loading ? emit('pause') : emit('start')">
        <span
          v-if="loading"
          class="flex items-center justify-center | py-0.5">
          <Loader />
          <span class="ml-2 | text-sm">{{ $t('pause') }}</span>
        </span>
        <span
          v-else
          class="text-sm | flex items-center justify-center | py-0.5">
          {{ $t('start') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loader from '@/components/Loader.vue'
import { useDarkModeStore } from '@/stores/darkMode.store'
import { useUserStore } from '@/stores/user.store'
import { ref, watch } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'pause'): void
}>()

const userStore = useUserStore()
const darkModeStore = useDarkModeStore()

const isHidePopup = ref(false)
const hidePopup = (value: boolean) => (isHidePopup.value = value)

watch(
  () => props.loading,
  () => {
    hidePopup(false)
  }
)
</script>

<style></style>
