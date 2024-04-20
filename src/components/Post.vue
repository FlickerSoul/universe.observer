<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PropType } from 'vue'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'

import { useHead } from '@vueuse/head'
import { SupportedLangs } from '../../scripts/lang'
import { matchMultiLangBase } from '../../scripts/routing-support'
import type { IPostData } from './types'
import PostDate from './PostDate.vue'
import PostTag from './PostTag.vue'
import LangIndicator from './LangIndicator.vue'
import { isDark, renderMermaidInPlace } from '~/logics'

const props = defineProps({
  customFrontmatter: {
    type: Object as PropType<IPostData>,
    required: false,
    default: undefined,
  },
})
const Discussion = defineAsyncComponent(() => import('@giscus/vue'))

const router = useRouter()
const content = ref<HTMLDivElement>()

const TOCs = computed(() => {
  return content.value?.getElementsByClassName('table-of-contents')
})

const TOC = computed(() => {
  return TOCs.value && TOCs.value[0]
})

const isTOCToggled = ref<boolean>(false)

// handle i18n language control
const route = router.currentRoute

function handleLanguageChange(lang: SupportedLangs) {
  const { path, meta: { frontmatter: { langs } } } = route.value
  if (!(langs?.includes(lang) || lang === SupportedLangs.__translate) || !(lang in SupportedLangs))
    return

  const matched = matchMultiLangBase(path)

  if (matched) {
    router.push({
      path: `${matched[1]}${lang}`,
      replace: true,
    })
  }
}

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

onMounted(() => {
  if (isTOCToggled.value)
    TOC.value?.classList.add('toc-show')

  TOC.value?.parentElement?.classList.add('ma-0')
})

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

// handle mermaid graphing
onMounted(async () => {
  await renderMermaidInPlace()
})

watch(isDark, async () => {
  await renderMermaidInPlace()
})

const frontmatter = computed<IPostData>(() => {
  if (props.customFrontmatter === undefined)
    return route.value.meta.frontmatter
  else
    return props.customFrontmatter
})

useHead({
  title: `${frontmatter.value.title} %sep %site.name`,
  meta: [
    { name: 'description', content: frontmatter.value.description },
    { name: 'og:description', content: frontmatter.value.description },
    { name: 'og:title', content: frontmatter.value.title },
  ],
})
</script>

<template>
  <div v-show="frontmatter.title || frontmatter.display" class="post-wrapper post-center">
    <div class="flex justify-center items-center flex-row">
      <h1 class="title">
        {{ frontmatter.title }}
      </h1>
      <div style="flex: 1" />
      <div class="text-sm flex gap-3 h-min">
        <LangIndicator
          v-for="lang in [...(frontmatter.langs || [])].sort().reverse()"
          :key="lang"
          :lang="lang"
          class="cursor-pointer"
          :class="lang === frontmatter.lang ? ['cursor-not-allowed', 'opacity-50'] : []"
          @click="lang === frontmatter.lang ? undefined : handleLanguageChange(lang as SupportedLangs)"
        />
      </div>
    </div>

    <div v-if="frontmatter.subtitle" class="post-meta">
      {{ frontmatter.subtitle }}
    </div>

    <div class="post-meta post-date-wrapper">
      <PostDate
        :created-at="frontmatter.createdAt"
        :updated-at="frontmatter.updatedAt"
        class="ma"
      />
    </div>
    <div v-if="frontmatter.tags" class="post-meta flex flex-wrap font-mono items-center text-sm">
      <span class="mr2">Tags: </span>
      <PostTag v-for="tag in frontmatter.tags" :key="tag" :tag="tag" class="mr-4 post-tag" />
    </div>

    <div class="mb-12" />

    <article ref="content" class="post-content mb-3em">
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

    <template v-if="frontmatter?.hasComments !== false">
      <hr>
      <Discussion
        id="giscus-comments"
        host="https://giscus.universe.observer"
        repo="flickersoul/universe.observer"
        repo-id="R_kgDOI6RsMA"
        category="General"
        category-id="DIC_kwDOI6RsMM4CVqJj"
        mapping="pathname"
        strict="1"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        :theme="isDark ? 'preferred_color_scheme' : 'light'"
        lang="en"
        loading="lazy"
      />
    </template>
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

p.hidden-lang
  display: none
</style>
