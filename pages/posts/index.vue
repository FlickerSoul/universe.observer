<script setup lang="ts">
import Post from '~/components/Post.vue'
import PostList from '~/components/PostList.vue'
import TagFilter from '~/components/TagFilter.vue'
</script>

<template>
  <Post :frontmatter="{ title: 'Posts', hasComments: false }">
    <Suspense>
      <TagFilter />
    </Suspense>
    <PostList />
  </Post>
</template>
