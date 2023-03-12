<script setup lang="ts">
import type { IInfoItem } from './types'

const { info } = defineProps<{
  info: IInfoItem
}>()
</script>

<template>
  <div>
    <span :class='[info.icon]' class="inline-block text-lg mr-2 align-middle" />
    <a v-if="info.url" :href="info.url" target="_blank"> {{info.value}} </a> 
    <span v-else>{{ info.value }}</span>
  </div>
</template>

<style scoped lang="sass">
a
  color: inherit
</style>
