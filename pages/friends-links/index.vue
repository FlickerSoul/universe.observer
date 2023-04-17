<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onMounted } from 'vue'
import { cursor, moveCursor } from './components/utils'
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
      name: 'Jabriel Zhang',
      url: 'https://wh0.is',
      about: ['A wizard who\'s mastering Unreal Engine', 'Artist and Game Dev'],
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
  interestingSites: [
    { name: 'Matrix67', url: 'http://www.matrix67.com/' },
    { name: 'Matrix67: The Aha Moments', url: 'http://www.matrix67.com/blog/' },
    { name: 'STRML: Projects and Work', url: 'https://www.strml.net/' },
    { name: '虎兔手记', url: 'http://notes.localhost-8080.com/' },
    { name: '考据癖', url: 'http://localhost-8080.com/' },
    { name: 'Halfrost\'s Field | 冰霜之地', url: 'https://halfrost.com/' },
    { name: '失眠海峡', url: 'https://blog.imalan.cn/' },
    { name: '1010Code', url: 'https://andy6804tw.github.io/' },
    { name: 'Kamikat\'s Blog', url: 'https://banana.moe/posts/' },
    { name: 'Zirnc\'s Blog', url: 'https://blog.chungzh.cn/' },
    { name: '无垠', url: 'https://flyhigher.top/' },
    { name: 'Math & Programming', url: 'https://jeremykun.com/' },
    { name: '编程随想', url: 'https://program-think.blogspot.com/' },
    { name: 'royee', url: 'https://guanhui07.github.io/blog/' },
    { name: '深红', url: 'https://anata.me/' },
    { name: 'DIYgod', url: 'https://diygod.me/' },
    { name: '宇宙よりも遠い場所', url: 'https://kirainmoe.com/' },
    { name: '乌云压顶是吧', url: 'https://wyydsb.xin/' },
  ],
} as const

const frontmatter = { title: 'Friends\' Links', createdAt: '2023-04-12', updatedAt: '2023-04-12' } as const

onMounted(() => {
  cursor.value = document.querySelector('#cursor') as HTMLDivElement
})
</script>

<template>
  <Post :frontmatter="frontmatter" class="link-page" @mousemove="moveCursor">
    <LinkSection :links="LINKS.friends" name="Friends" />
    <LinkSection :links="LINKS.interestingSites" name="Interesting Sites" />
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
    --cursor-color: #c5c5c5

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
      transform: translate(var(--hover-translateX), var(--hover-translateY)) scale(var(--hover-scale))
      transition-property: opacity
    &.is-locked
      --cursor-radius: 0.3em
      transition-property: width, height, left, top
      #cursor__content
        opacity: 0.2
</style>
