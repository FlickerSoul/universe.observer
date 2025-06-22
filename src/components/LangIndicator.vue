<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { LangType } from '~/components/types'

const { lang } = defineProps({
  lang: { type: String as PropType<LangType> },
})

const langDisplay = computed(() => {
  switch (lang) {
    case 'en':
      return 'EN'
    case 'zh':
      return '简'
    case '__translate':
      return '💬'
    default:
      return '??'
  }
})
</script>

<template>
  <span
    class="inline-block text-center lang-display border border-current border-solid rounded"
  >
    {{ langDisplay }}
  </span>
</template>

<style lang="sass" scoped>
@use '~/styles/variables.sass' as v
span.lang-display
  min-width: v.$lang-indicator-width
</style>
