<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { PropType } from 'vue'
import { computed, onMounted, ref } from 'vue'
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

const TOCs = computed(() => {
  return content.value?.getElementsByClassName('table-of-contents')
})

const TOC = computed(() => {
  return TOCs.value && TOCs.value[0]
})

const isTOCToggled = ref<boolean>(false)

watch(
  isTOCToggled,
  (val) => {
    if (!TOC.value)
      return
    if (val)
      TOC.value.classList.add('toc-show')
    else
      TOC.value.classList.remove('toc-show')
  },
)

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
      } else {
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
  <div v-show="frontmatter.title || frontmatter.display" class="post-wrapper post-center">
    <h1 class="post-meta title mb-4">
      {{ frontmatter.title }}
    </h1>
    <div v-if="frontmatter.subtitle" class="post-meta">
      {{ frontmatter.subtitle }}
    </div>
    <div class="post-meta post-date-wrapper">
      <PostDate v-bind="frontmatter" class="ma" />
    </div>
    <div v-if="frontmatter.tags" class="post-meta flex flex-wrap font-mono items-center text-sm">
      <span class="mr2">Tags: </span>
      <PostTag v-for="tag in frontmatter.tags" :key="tag" :tag="tag" class="mr-4 post-tag" />
    </div>

    <div class="mb-12" />

    <article ref="content" class="post-content">
      <div
        v-if="TOC"
        class="border border-solid border-current rounded box-content pa-1 cursor-pointer"
        style="width: max-content"
        @click="isTOCToggled = !isTOCToggled"
      >
        TOC
        <div
          class="inline-block i-mdi-arrow-down-right align-middle toc-icon"
          :class="{ 'toc-icon-up': isTOCToggled }"
        />
      </div>
      <slot />
    </article>

    <hr>

    <div v-if="route.path !== '/'" class="my-8">
      <router-link
        :to="route.path.split('/').slice(0, -1).join('/') || '/'"
        class="font-mono no-underline opacity-50 hover:opacity-90"
      >
        cd ..
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use 'src/styles/variables' as v

.post-wrapper
  .post-tag
    color: v.$post-tag-color
    border-bottom-width: 1.5px
    border-bottom-style: solid
    border-color: v.$post-tag-color
    cursor: pointer
    font-size: 0.875rem
  .toc-icon
    transition: transform 0.2s ease-in-out
  .toc-icon-up
    transform: scaleY(-1)
</style>

<style lang="sass">
.table-of-contents
  height: 0
  overflow: hidden
  transition: height 0.2s ease-in-out
.toc-show
  height: auto
  overflow: visible
</style>
