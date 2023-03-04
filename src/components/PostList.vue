<script setup lang="ts">
import { computed } from 'vue'
import { useCommStore } from '../store'
import { getVisiblePosts } from '../logics/get-posts'
import type { IListedPostData } from './types'
import PostItem from './PostItem.vue'

const posts: IListedPostData[] = getVisiblePosts()
  .sort((a, b) => -new Date(a.meta.frontmatter.createdAt) + +new Date(b.meta.frontmatter.createdAt))
  .map((route) => {
    return {
      path: route.path,
      createdAt: route.meta.frontmatter.createdAt,
      updatedAt: route.meta.frontmatter.updatedAt,
      abstract: route.meta.frontmatter.abstract,
      title: route.meta.frontmatter.title,
      lang: route.meta.frontmatter.lang,
      langs: route.meta.frontmatter.langs,
      tags: route.meta.frontmatter.tags,
    }
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

function diffYear(a = '', b = '') {
  return new Date(a).getFullYear() !== new Date(b).getFullYear()
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
        v-if="(idx === 0 || diffYear(displayedPosts[idx - 1].createdAt, displayedPosts[idx].createdAt))
          && post.createdAt"
      >
        <div class="relative h20 pointer-prevent-none">
          <span class="absolute font-bold mt-3 text-8rem left--1rem op-15">
            {{ new Date(post.createdAt).getFullYear() }}
          </span>
        </div>
      </div>
      <PostItem :post="post" class="mt-6" />
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
