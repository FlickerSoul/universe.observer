<script setup lang="ts">
import { useHead } from '@vueuse/head'
import Post from '~/components/Post.vue'
import PostList from '~/components/PostList.vue'
import TagFilter from '~/components/TagFilter.vue'

const DESCRIPTION = 'Here is a list of posts I wrote!'
useHead({
  meta: [
    { name: 'description', content: DESCRIPTION },
    { name: 'og:description', content: DESCRIPTION },
  ],
})
</script>

<template>
  <Post :frontmatter="{ title: 'Posts', hasComments: false, description: DESCRIPTION }">
    <Suspense>
      <TagFilter />
    </Suspense>
    <PostList />
  </Post>
</template>
