<script setup lang="ts">
import LangIndicator from './LangIndicator.vue'
import PostDate from './PostDate.vue'
import type { IListedPostData } from './types'
import PostAbstract from './PostAbstract.vue'

const { post } = defineProps<{ post: IListedPostData }>()
</script>

<template>
  <li>
    <div class="post-item font-mono no-underline ">
      <div
        class="align-middle px-1 md:ml--10.5 mr1.5 inline-flex gap-2 md:flex-row-reverse lang-indicator-long flex-col"
      >
        <router-link
          v-for="lang in (post.langs || [post.lang]).sort()"
          :key="lang"
          class="border-none hover:border-none opacity-50 hover:opacity-75"
          :to="{ path: post.path, query: { lang } }"
        >
          <LangIndicator :lang="lang" />
        </router-link>
      </div>
      <router-link :to="post.path" class="border-none hover:border-none opacity-50 hover:opacity-75">
        <span class="align-middle text-1.4em ml-0.4em">
          {{ post.title }}
        </span>
        <PostAbstract v-if="post.abstract" :abstract="post.abstract" class="post-abstract post-meta" />
        <PostDate v-bind="post" class="post-dates post-meta" />
      </router-link>
    </div>
  </li>
</template>

<style lang="sass" scoped>
@use 'src/styles/variables' as v

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
.lang-indicator-long
  width: v.$lang-indicator-width
</style>
