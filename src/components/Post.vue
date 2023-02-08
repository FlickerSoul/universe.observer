<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { PropType } from 'vue'
import { onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { IPostData } from './types'
import PostDate from './PostDate.vue'
import PostTag from './PostTag.vue'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object as PropType<IPostData>,
    required: true,
  },
})
const route = useRoute()
const router = useRouter()
const content = ref<HTMLDivElement>()

// handling anchors and scroll to hash
onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      document.querySelector(decodeURIComponent(location.hash))
        ?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')
    if (
      !event.defaultPrevented
        && link
        && event.button === 0
        && link.target !== '_blank'
        && link.rel !== 'external'
        && !link.download
        && !event.metaKey
        && !event.ctrlKey
        && !event.shiftKey
        && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return
      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }
  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })
  navigate()
  setTimeout(navigate, 500)
})
</script>

<template>
  <div v-show="frontmatter.title || frontmatter.display" class="post-wrapper">
    <h1 class="post-meta title">
      {{ frontmatter.title }}
    </h1>
    <div v-if="frontmatter.subtitle" class="post-meta">
      {{ frontmatter.subtitle }}
    </div>
    <div class="post-meta post-date-wrapper">
      <PostDate v-bind="frontmatter" class="ma" />
    </div>

    <article ref="content" class="post-content">
      <slot />
    </article>

    <hr>

    <div v-if="frontmatter.tags" class="post-meta flex flex-wrap font-mono items-center py2 mt8">
      <span class="mr2">Tags: </span>
      <PostTag v-for="tag in frontmatter.tags" :key="tag" :tag="tag" class="mr-4 post-tag" />
    </div>

    <div v-if="route.path !== '/'" class="mt-5">
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
@use 'src/styles/variables' as v

.post-wrapper
  .post-meta
    text-align: center
  .post-tag
    color: v.$post-tag-color
    border-bottom-width: 1.5px
    border-bottom-style: solid
    border-color: v.$post-tag-color
    cursor: pointer
    font-size: 0.875rem
</style>
