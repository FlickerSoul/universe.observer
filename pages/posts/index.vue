<script setup lang="ts">
import { useHead } from '@vueuse/head'
import Post from '~/components/Post.vue'
import PostList from '~/components/PostList.vue'
import TagFilter from '~/components/TagFilter.vue'

const TITLE = 'Posts %sep %site.name'
const DESCRIPTION = 'Here is a list of posts I wrote!'
useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESCRIPTION },
    { name: 'og:description', content: DESCRIPTION },
    { name: 'og:title', content: TITLE },
  ],
})
</script>

<template>
  <Post :custom-frontmatter="{ title: 'Posts', hasComments: false, description: DESCRIPTION }">
    <Suspense>
      <TagFilter />
    </Suspense>
    <PostList />
  </Post>
</template>
