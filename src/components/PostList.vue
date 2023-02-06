<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { IListedPostData } from './types'

const router = useRouter()
const posts: IListedPostData[] = router.getRoutes()
  .filter(route => route.path.startsWith('/posts/') && route.path.endsWith('.html'))
  .sort((a, b) => +new Date(a.meta.frontmatter.createdAt) - +new Date(b.meta.frontmatter.createdAt))
  .map((route) => {
    return {
      path: route.path,
      createdAt: route.meta.frontmatter.createdAt,
      title: route.meta.frontmatter.title,
      lang: route.meta.frontmatter.lang,
      tags: route.meta.frontmatter.tags,
    }
  })
</script>

<template>
  <ul>
    <template v-if="posts.length === 0">
      <div>
        no posts yet, coming soon ...
      </div>
    </template>
    <template v-for="post in posts" :key="post.path">
      <li>
        <router-link :to="post.path" class="font-mono no-underline opacity-50 hover:opacity-75">
          {{ post.createdAt }} - {{ post.title }}
        </router-link>
      </li>
    </template>
  </ul>
</template>
