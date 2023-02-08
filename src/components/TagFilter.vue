<script setup lang="ts">
import { useCommStore } from '../store'
import TagSelector from './TagSelector.vue'

const comm = useCommStore()
</script>

<template>
  <div class="tags">
    <div class="tags-title">
      Tags:
    </div>
    <div class="tags-check-boxes">
      <template v-for="tag in comm.tagList" :key="tag">
        <TagSelector :tag-name="tag" class="tag-check-box" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="sass">
.tags-check-boxes
  display: grid
  grid-template-columns: auto auto auto auto auto
</style>
