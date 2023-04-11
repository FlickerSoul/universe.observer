<script setup lang="ts">
import { computed } from 'vue'
import type { IListedPostData } from './types'
import PostItem from './PostItem.vue'
import { useCommStore } from '~/store'
import { getVisiblePosts } from '~/logics/get-posts'

const UNKNOWN_DATE_REPR = '?'

const posts: IListedPostData[] = getVisiblePosts()
  .map((route) => {
    return {
      path: route.path,
      createdAt: route.meta.frontmatter.createdAt ? new Date(route.meta.frontmatter.createdAt) : undefined,
      updatedAt: route.meta.frontmatter.updatedAt ? new Date(route.meta.frontmatter.updatedAt) : undefined,
      abstract: route.meta.frontmatter.abstract,
      title: route.meta.frontmatter.title,
      lang: route.meta.frontmatter.lang,
      langs: route.meta.frontmatter.langs,
      tags: route.meta.frontmatter.tags,
    }
  })
  .sort((a, b) => {
    if (a.createdAt && b.createdAt)
      return (-a.createdAt + +b.createdAt)
    else if (a.createdAt)
      return -1
    else
      return 1
  })

const comm = useCommStore()
const displayedPosts = computed(() => {
  return posts.filter((post) => {
    return comm.selectedTags.length === 0
      ? true
      : comm.selectedTags.every(tag => post.tags?.includes(tag),
      )
  })
})

function diffYear(a: Date | undefined, b: Date | undefined) {
  if (a === undefined && b === undefined)
    return false
  else if (a === undefined || b === undefined)
    return true
  else
    return a.getFullYear() !== b.getFullYear()
}
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="post-list lt-md:ps">
    <template v-if="posts.length === 0">
      <div>
        no posts yet, coming soon ...
      </div>
    </template>
    <template v-for="(post, idx) in displayedPosts" :key="post.path">
      <div
        v-if="(idx === 0 || diffYear(displayedPosts[idx - 1].createdAt, displayedPosts[idx].createdAt))"
      >
        <div class="relative h20 pointer-prevent-none">
          <span class="absolute font-bold mt-8 md:mt-4 md:text-7rem text-5rem right-0.2rem op-15">
            {{ post.createdAt ? post.createdAt.getFullYear() : UNKNOWN_DATE_REPR }}
          </span>
        </div>
      </div>
      <PostItem :post="post" class="mt-12" />
    </template>
  </TransitionGroup>
</template>

<style scoped lang="sass">
@use 'src/styles/global' as g
ul.post-list
  list-style: none

.list-enter-active,
.list-leave-active
  transition: all 0.5s ease

.list-enter-from,
.list-leave-to
  opacity: 0
  transform: translateX(30px)
</style>
