<script setup lang="ts">
import type { IInfoItem } from './types'

const { info } = defineProps<{
  info: IInfoItem
}>()
</script>

<template>
  <div :id="`cv-info-item-${info.name}`">
    <i
      :class="[info.icon]"
      :title="info.name"
      class="cv-info-icon inline-block text-lg mr-2 align-middle"
    />
    <a v-if="info.url" :href="info.url" target="_blank">{{ info.value }}</a>
    <span v-else :class="{ 'font-mono': info.mono }">{{ info.value }}</span>
  </div>
</template>

<style scoped lang="sass">
a
  color: inherit

icons
  @apply i-mdi-email i-mdi-linkedin i-mdi-github i-mdi-key
</style>
