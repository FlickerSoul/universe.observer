<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useCommStore } from '../store'
import TagSelector from './TagSelector.vue'
import type { IListedPostData } from './types'

const comm = useCommStore()
async function buildTags() {
  useRouter().getRoutes()
    .forEach((route: { meta: { frontmatter: IListedPostData } }) => {
      route.meta.frontmatter.tags?.forEach((tag: string) => {
        comm.pushTag(tag)
      })
    })
}

await buildTags()

const tagToggleFlag = ref(false)

function toggleTags() {
  tagToggleFlag.value = !tagToggleFlag.value
}
</script>

<template>
  <div class="tags mt-2 w-90% py-2 px-7 font-mono">
    <div class="align-middle inline-block border border-style-solid border-current rounded text-xs py-0.5 px-1 md:ml--7.5 mr2" @click="toggleTags">
      <div class="i-mdi-chevron-down cursor-pointer tags-arrow" :class="{ 'rotate-arrow': tagToggleFlag }" />
    </div>
    <span class="pb-3">
      Tags:
    </span>
    <div class="tags-check-boxes" :class="{ 'tags-check-boxes-closed': !tagToggleFlag }">
      <div class="grid px-3 mt-4 grid-cols-3 lt-md:grid-cols-2">
        <TagSelector v-for="tag in comm.tags" :key="tag" :tag-name="tag" class="tag-check-box case-upper" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.tags
  .tags-check-boxes
    transition: all 300ms cubic-bezier(.25, .8, .50, 1)
  .tags-check-boxes-closed
    height: 0
    overflow-y: hidden
.tags-arrow
  transition: all 300ms cubic-bezier(.25, .8, .50, 1)
.rotate-arrow
  transform: rotate(180deg)
</style>
