<script setup lang="ts">
import { useRouter } from 'vue-router'
import LangIndicator from './LangIndicator.vue'
import PostDate from './PostDate.vue'
import type { IListedPostData } from './types'
import PostAbstract from './PostAbstract.vue'

const { post } = defineProps<{ post: IListedPostData }>()
const router = useRouter()

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'A' && target.closest('a'))
    return

  if (e.metaKey)
    window.open(post.path, '_blank')
  else
    router.push({ path: post.path })
}
</script>

<template>
  <li>
    <div class="post-item font-mono no-underline">
      <div class="align-middle md:ml--10.5 mr-0.6em inline-flex gap-2 flex-row-reverse md:w-25px">
        <router-link
          v-for="lang in (post.langs || [post.lang]).sort()"
          :key="lang"
          class="border-none hover:border-none opacity-50 hover:opacity-75"
          :to="{ path: post.path, query: { lang } }"
        >
          <LangIndicator :lang="lang" />
        </router-link>
        <span v-if="post.wip">
          🚧
        </span>
      </div>
      <div
        class="post-body inline cursor-pointer opacity-50 hover:opacity-100 ml-0.4em
        transition-opacity transition-duration-500"
        @click="handleClick"
      >
        <div class="md:inline-block block align-middle w-100%">
          <div class="flex md:flex-row flex-col md:place-items-center">
            <span class="post-title text-1.4em inline-block">
              {{ post.title }}
            </span>

            <div style="flex-grow: 1;" />
            <span v-if="post.subtitle" class="post-title inline-block">
              {{ post.subtitle }}
            </span>
          </div>
        </div>
        <PostDate v-bind="post" class="post-dates w-100%" />
        <PostAbstract v-if="post.description" :abstract="post.description" class="post-abstract w-100%" />
      </div>
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
