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
        class="align-middle px-1 md:ml--10.5 mr1.5 inline-flex gap-2 flex-row-reverse md:w-25px"
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
      <router-link :to="post.path" class="post-body border-none hover:border-none opacity-50 hover:opacity-75">
        <span class="post-title md:inline-block block align-middle text-1.4em ml-0.4em">
          {{ post.title }}
        </span>
        <PostDate v-bind="post" class="post-dates post-meta" />
        <PostAbstract v-if="post.description" :abstract="post.description" class="post-abstract post-meta" />
      </router-link>
    </div>
  </li>
</template>

<style lang="sass" scoped>
@use 'src/styles/variables' as v

.title-text
  font-size: 1.2em

.post-title
  line-height: 1.2em
  margin-top: 0.2em

.post-abstract
  font-size: 0.9em
  width: 80%

.post-dates
  font-size: 0.8em

.post-meta
  margin-left: 0.6em

.lang-indicator-long
  width: v.$lang-indicator-width

.post-body > *
  margin-bottom: 0.4em
</style>
