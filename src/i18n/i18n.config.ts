import { createI18n } from 'vue-i18n'
import messages from './messages.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  warnHtmlMessage: false,
  locale: document.documentElement.lang || 'en',
  messages
})
export default i18n
