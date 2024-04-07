<script setup lang="ts">
import { useHead } from '@vueuse/head'
import type { IToyInfo } from './types'

const toys: IToyInfo[] = [
  { name: 'Spin', url: '/toys/spin' },
  { name: 'Kaleidoscope', url: '/toys/kaleidoscope/' },
  { name: 'Soundscape', url: '/toys/soundscape/' },
]
const TITLE = 'Toys %sep %site.name'
const DESCRIPTION = 'Here is a list of toys I made!'
useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESCRIPTION },
    { name: 'og:description', content: DESCRIPTION },
    { name: 'og:title', content: TITLE },
  ],
})
</script>

<template>
  <div class="post-center">
    <p>
      Here is a list of toys I made myself or with peers :)
    </p>
    <div class="flex gap-4">
      <div v-for="(toy, i) in toys" :key="toy.name">
        <span>{{ i }}. </span>
        <a v-if="toy.outside" :href="toy.url">
          {{ toy.name }}
        </a>
        <router-link v-else :to="toy.url">
          {{ toy.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>
