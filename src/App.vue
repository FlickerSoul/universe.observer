<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
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
const AUTHOR = 'Larry Zeng'

useHead({
  templateParams: {
    sep: '|',
    site: {
      url: 'https://universe.observer',
      name: TITLE,
      author: AUTHOR,
    },
  },
  title: TITLE,
  meta: [
    { property: 'og:title', content: TITLE },
    { property: 'og:type', content: 'website' },
    { name: 'description', content: DESCRIPTION },
    { property: 'og:description', content: DESCRIPTION },
  ],
})

useHead({
  meta: [
    { property: 'og:icon', content: () => isDark.value ? '/logo-white-lower' : '/logo-black-lower' },
  ],
})

useHead({
  meta: [
    { property: 'og:url', content: () => `%site.url${route.fullPath}` },
  ],
})
</script>

<template>
  <NavBar class="no-print" />
  <main>
    <router-view />
    <Footer class="no-print" />
    <SpeedInsights />
  </main>
</template>
