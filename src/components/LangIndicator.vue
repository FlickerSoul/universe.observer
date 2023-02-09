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
      return '中文'
    default:
      return '??'
  }
})
</script>

<template>
  <span style="min-width: 25px;" class="inline-block text-center">
    {{ langDisplay }}
  </span>
</template>
