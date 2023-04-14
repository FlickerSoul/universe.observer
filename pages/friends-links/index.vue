<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useHead } from '@vueuse/head'
import LinkSection from './components/LinkSection.vue'
import Post from '~/components/Post.vue'

const DESCRIPTION = 'A page containing links to my friends and some places I found interesting!'
const TITLE = 'Friends\' Links | Universe Observer'

useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESCRIPTION },
    { name: 'og:title', content: TITLE },
    { name: 'og:description', content: DESCRIPTION },
  ],
})

const LINKS = {
  friends: [
    {
      name: 'Jabrial Zhang',
      url: 'https://wh0.is',
    },
    {
      name: 'Sima Nerush',
      url: 'https://www.simanerush.com/',
    },
    {
      name: 'Huggy',
      url: 'https://blog.huggy.moe/',
    },
    {
      name: 'Yihui\'s Blog',
      url: 'https://yihuiblog.top/',
    },
  ],
  interestingBlogs: [],
} as const

const frontmatter = { title: 'Friends\' Links', createdAt: '2023-04-12', updatedAt: '2023-04-12' } as const

const cursor = shallowRef<HTMLDivElement>()
const isLocked = ref(false)

function moveCursor(event: MouseEvent) {
  if (isLocked.value)
    return
  const { x, y } = event
  cursor.value?.style.setProperty('--cursor-top', `${y}px`)
  cursor.value?.style.setProperty('--cursor-left', `${x}px`)
}
</script>

<template>
  <Post :frontmatter="frontmatter" class="link-page" @mousemove="moveCursor">
    <LinkSection v-model:locked="isLocked" :links="LINKS.friends" name="Friends" :cursor="cursor" />
    <LinkSection v-model:locked="isLocked" :links="LINKS.interestingBlogs" name="Interesting Blogs" :cursor="cursor" />
    <div id="cursor" ref="cursor">
      <div id="cursor__content" />
    </div>
  </Post>
</template>

<style lang="sass">
.link-page:not(:hover)
  #cursor
    display: none

html.dark
  #cursor
    --cursor-color: #fff

.link-page
  cursor: none
  *
    cursor: inherit
  #cursor
    --cursor-height: 1em
    --cursor-width: 1em
    --cursor-top: -1em
    --cursor-left: -1em
    --cursor-color: #515151
    --hover-scale: 1
    --hover-translateX: 0
    --hover-translateY: 0
    --cursor-radius: 1em
    transition-property: width, height
    translate: (-50%, -50%) scale(var(--hover-scale))
    pointer-events: none
    z-index: 4
    top: var(--cursor-top)
    left: var(--cursor-left)
    width: var(--cursor-width)
    height: var(--cursor-height)
    &, #cursor__content
      position: absolute
      transition-duration: 0.1s
      transition-timing-function: ease-out
    #cursor__content
      opacity: 0.5
      border-radius: var(--cursor-radius)
      background-color: var(--cursor-color)
      bottom: 0
      left: 0
      right: 0
      top: 0
      transform: translate(var(--hover-translateX), var(--hover-translateY))
      transition-property: opacity
    &.is-locked
      transition-property: width, height, left, top
      --cursor-radius: 0.3em
      #cursor__content
        opacity: 0.1
</style>
