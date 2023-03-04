<script setup lang="ts">
import { computed } from 'vue'

const { lang } = defineProps({
  lang: { type: String },
})

const langDisplay = computed(() => {
  switch (lang) {
    case 'en':
      return 'EN'
    case 'zh':
      return '简'
    default:
      return '??'
  }
})
</script>

<template>
  <span class="inline-block text-center lang-display border border-current border-solid rounded">
    {{ langDisplay }}
  </span>
</template>

<style lang="sass" scoped>
@use 'src/styles/variables' as v
span.lang-display
  min-width: v.$lang-indicator-width
</style>
