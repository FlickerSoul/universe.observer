<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCommStore } from '../store'
import TagSelector from './TagSelector.vue'
import type { IListedPostData } from './types'

const comm = useCommStore()
useRouter().getRoutes()
  .forEach((route: { meta: { frontmatter: IListedPostData } }) => {
    route.meta.frontmatter.tags?.forEach((tag: string) => {
      comm.pushTag(tag)
    })
  })
</script>

<template>
  <div class="tags">
    <div class="tags-title">
      Tags:
    </div>
    <div class="tags-check-boxes">
      <template v-for="tag in comm.tags" :key="tag">
        <TagSelector :tag-name="tag" class="tag-check-box" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="sass">
.tags
  width: 100%
  .tags-check-boxes
    display: grid
    grid-template-columns: auto auto auto auto
</style>
