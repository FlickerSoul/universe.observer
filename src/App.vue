<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { isDark } from './logics'

onMounted(() => {
  import('@vercel/analytics').then((mod) => {
    mod.inject()
  })
})

const route = useRoute()
const TITLE = 'Universe Observer'
const DESCRIPTION = 'Larry Z\'s blog'

useHead({
  templateParams: {
    sep: '|',
    site: {
      url: 'https://universe.observer',
      name: 'Universe Observer',
      author: 'Larry Zeng',
    },
  },
  title: TITLE,
  meta: [
    { property: 'og:title', content: TITLE },
    { property: 'og:icon', content: isDark ? '/logo-white-lower' : '/logo-black-lower' },
    { property: 'og:type', content: 'website' },
    { name: 'description', content: DESCRIPTION },
    { property: 'og:description', content: DESCRIPTION },
    { property: 'og:url', content: `%site.url${route.fullPath}` },
  ],
})

watch(isDark, (val) => {
  useHead({
    meta: [
      { property: 'og:icon', content: val ? '/logo-white-lower' : '/logo-black-lower' },
    ],
  })
})

watch(() => route.fullPath, (val) => {
  useHead({
    meta: [
      { property: 'og:url', content: `%site.url${val}` },
    ],
  })
})
</script>

<template>
  <NavBar class="no-print" />
  <main>
    <router-view />
    <Footer class="no-print" />
  </main>
</template>
