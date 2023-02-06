<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { PropType } from 'vue'
import type { IPostData } from './types'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object as PropType<IPostData>,
    required: true,
  },
})
const route = useRoute()
</script>

<template>
  <div v-show="frontmatter.title" class="post-wrapper">
    <h1 class="post-meta title">
      {{ frontmatter.title }}
    </h1>
    <div v-if="frontmatter.subtitle" class="post-meta">
      {{ frontmatter.subtitle }}
    </div>
    <div v-if="frontmatter.createdAt || frontmatter.updatedAt" class="post-meta">
      {{ frontmatter.createdAt }} - {{ frontmatter.updatedAt }}
    </div>
    <div v-if="frontmatter.tags" class="post-meta">
      {{ frontmatter.tags }}
    </div>
    <article ref="content" class="post-content">
      <slot />
    </article>

    <div v-if="route.path !== '/'" class="mt-7">
      <router-link
        :to="route.path.split('/').slice(0, -1).join('/') || '/'"
        class="font-mono no-underline opacity-50 hover:opacity-75"
      >
        cd ..
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="sass">
.post-wrapper
  .post-meta
    text-align: center
</style>
