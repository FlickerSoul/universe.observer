<script setup lang="ts">
import { useHead } from '@vueuse/head'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { isDark } from './logics'

useHead({
  meta: [
    { property: 'og:title', content: 'Universe Observer' },
    { property: 'og:icon', content: isDark ? '/logo-white-lower' : '/logo-black-lower' },
    { property: 'og:type', content: 'website' },
    { name: 'description', content: 'Larry Z\'s blog' },
  ],
})
</script>

<template>
  <NavBar />
  <main>
    <router-view />
    <Footer />
  </main>
</template>
