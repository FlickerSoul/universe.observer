import type { Ref } from 'vue'
import { ref } from 'vue'
import { SupportedLangs } from '../../scripts/markdown-i18n'

export interface I18n {
  currentLang: Ref<SupportedLangs>
  changeCurrentLang(lang: SupportedLangs | string): void
  getCurrentLang(): SupportedLangs
}

const DEFAULT_LANG = SupportedLangs.en

const langController = {
  currentLang: ref<SupportedLangs>(DEFAULT_LANG),
  changeCurrentLang(lang: SupportedLangs | string) {
    let res
    if (typeof lang === 'string')
      res = SupportedLangs[lang as keyof typeof SupportedLangs]
    else
      res = lang

    this.currentLang.value = res
  },
  getCurrentLang() {
    return this.currentLang.value
  },
} as I18n

export function useLangController() {
  return langController
}
