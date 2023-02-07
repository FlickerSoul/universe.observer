<script setup lang="ts">
import DateDisplay from './DateDisplay.vue'

const { createdAt, updatedAt } = defineProps({
  createdAt: { type: String },
  updatedAt: { type: String },
})
</script>

<template>
  <div class="post-meta post-date-wrapper font-mono ">
    <DateDisplay v-show="createdAt" class="post-date" :date="createdAt" name="Created@" />
    <div v-show="updatedAt" class="spacing" />
    <DateDisplay v-show="updatedAt" class="post-date" :date="updatedAt" name="Updated@" />
  </div>
</template>

<style scoped lang="sass">
.post-date-wrapper
  display: grid
  grid-template-columns: max-content 1em max-content
  max-width: max-content
  .post-date
    display: inline-block
</style>
