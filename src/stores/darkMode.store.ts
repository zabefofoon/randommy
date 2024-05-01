import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore(
  'darkMode',
  () => {
    const isDarkMode = ref(false)
    const setDarkMode = (value: boolean) => (isDarkMode.value = value)
    const toggleDarkMode = () => (isDarkMode.value = !isDarkMode.value)
    return { isDarkMode, setDarkMode, toggleDarkMode }
  },
  {
    persist: {
      paths: ['isDarkMode']
    }
  }
)
