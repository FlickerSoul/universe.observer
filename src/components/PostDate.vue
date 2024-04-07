<script setup lang="ts">
import DateDisplay from './DateDisplay.vue'

const { createdAt, updatedAt } = defineProps({
  createdAt: { type: [String, Date] },
  updatedAt: { type: [String, Date] },
})
</script>

<template>
  <div class="font-mono flex flex-row flex-nowrap gap-4">
    <DateDisplay v-show="createdAt" class="post-date" :date="createdAt" name="Created@" />
    <DateDisplay v-show="updatedAt" class="post-date" :date="updatedAt" name="Updated@" />
  </div>
</template>

<style scoped lang="sass">
.post-date
  display: inline-block
</style>
