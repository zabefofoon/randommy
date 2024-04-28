<template>
  <div
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 | flex flex-col items-center justify-center"
    v-show="!isHidePopup">
    <div class="relative shadow-lg">
      <button
        @click="hidePopup(true)"
        class="absolute top-1 left-1">
        <i class="icon icon-close | text-sm"></i>
      </button>
      <div class="w-[240px] aspect-square bg-slate-100 | rounded-t-lg">
        <iframe
          width="240"
          height="240"
          allowtransparency="true"
          src="https://tab2.clickmon.co.kr/pop/wp_ad_250.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1138899%7C%5E%7CAdver_M_1046207&mon_rf=REFERRER_URL&mon_direct_url=URLENCODE_PASSBACK_INPUT"
          frameborder="0"
          scrolling="no"></iframe>
      </div>
      <div class="flex">
        <select
          v-model="userStore.sex"
          class="bg-white | text-sm | border-r | w-full | px-2 py-1">
          <option value="m">{{ $t('m') }}</option>
          <option value="w">{{ $t('w') }}</option>
        </select>
        <select
          v-model="userStore.country"
          class="bg-white | text-sm | w-[140px] truncate overflow-hidden | p-1">
          <option
            v-for="country in userStore.allCountries"
            :value="country.code">
            {{ $t(`${country.code}`) }}({{ country.code }})
          </option>
        </select>
      </div>

      <button
        class="w-full | border rounded-b-lg | px-8 py-1.5 | bg-slate-500 | text-white"
        @click="loading ? emit('pause') : emit('start')">
        <span v-if="loading">
          <Loader />
          <span class="ml-2 | text-sm">{{ $t('pause') }}</span>
        </span>
        <span
          v-else
          class="text-sm">
          {{ $t('start') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Loader from '@/components/Loader.vue'
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
