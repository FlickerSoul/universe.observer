<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useCommStore } from '../store'
import type { IListedPostData } from './types'
import PostDate from './PostDate.vue'
import LangIndicator from './LangIndicator.vue'

const router = useRouter()
const posts: IListedPostData[] = router.getRoutes()
  .filter(route => route.path.startsWith('/posts/') && !route.path.endsWith('.html'))
  .sort((a, b) => +new Date(a.meta.frontmatter.createdAt) - +new Date(b.meta.frontmatter.createdAt))
  .map((route) => {
    return {
      path: route.path,
      createdAt: route.meta.frontmatter.createdAt,
      updatedAt: route.meta.frontmatter.updatedAt,
      title: route.meta.frontmatter.title,
      lang: route.meta.frontmatter.lang,
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
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="post-list">
    <template v-if="posts.length === 0">
      <div>
        no posts yet, coming soon ...
      </div>
    </template>
    <template v-for="post in displayedPosts" :key="post.path">
      <router-link :to="post.path" class="post-item font-mono no-underline opacity-50 hover:opacity-75">
        <li class="pb-4">
          <div>
            <LangIndicator v-bind="post" class="lang-indicator align-middle" />
            <span class="align-middle">
              {{ post.title }}
            </span>
            <PostDate v-bind="post" class="post-dates" />
          </div>
        </li>
      </router-link>
    </template>
  </TransitionGroup>
</template>

<style scoped lang="sass">
@use 'src/styles/global' as g
ul.post-list
  list-style: none
  .post-dates
    display: block
    font-size: 0.8em
    margin-top: 0.4em

html
  .lang-indicator
    --at-apply: "text-xs border border-current border-solid rounded px-1 md:ml--10.5 mr2"

.list-enter-active,
.list-leave-active
  transition: all 0.5s ease

.list-enter-from,
.list-leave-to
  opacity: 0
  transform: translateX(30px)
</style>
