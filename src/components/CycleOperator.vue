<script setup lang="ts">
defineProps<{
  canPrev: boolean
  canNext: boolean
  step: number
  totalSteps: number
  prev: () => void
  next: () => void
}>()
</script>

<template>
  <div class="flex gap-2 justify-center">
    <div :class="{ 'control-button': canPrev }" @click="prev">
      {{ canPrev ? '⬅️' : '⛔️' }}
    </div>
    <div>
      <span>{{ step + 1 }}</span> / {{ totalSteps }}
    </div>
    <div :class="{ 'control-button': canNext }" @click="next">
      {{ canNext ? '➡️' : '⛔️' }}
    </div>
  </div>
</template>

<style scoped lang="sass">
.control-button
  @apply cursor-pointer
</style>
