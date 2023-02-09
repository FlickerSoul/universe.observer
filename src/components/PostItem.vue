<script setup lang="ts">
import LangIndicator from './LangIndicator.vue'
import PostDate from './PostDate.vue'
import type { IListedPostData } from './types'
import PostAbstract from './PostAbstract.vue'

const { post } = defineProps<{ post: IListedPostData }>()
</script>

<template>
  <li>
    <router-link :to="post.path" class="post-item font-mono no-underline opacity-50 hover:opacity-75">
      <div>
        <LangIndicator v-bind="post" class="align-middle text-xs border border-current border-solid rounded px-1 md:ml--10.5 mr2" />
        <span class="align-middle title-text ml-0.4em">
          {{ post.title }}
        </span>
        <PostAbstract v-if="post.abstract" :abstract="post.abstract" class="post-abstract post-meta" />
        <PostDate v-bind="post" class="post-dates post-meta" />
      </div>
    </router-link>
  </li>
</template>

<style lang="sass" scoped>
.title-text
  font-size: 1.2em
.post-abstract
  margin-top: 0.4em
  font-size: 0.9em
  width: 80%
.post-dates
  margin-top: 0.4em
  font-size: 0.8em
.post-meta
  margin-left: 0.6em
</style>
