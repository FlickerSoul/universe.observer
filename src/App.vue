<script setup lang="ts">
import { useHead } from '@vueuse/head'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

useHead({
  meta: [
    { property: 'og:title', content: 'Universe Observer' },
    { property: 'og:icon', content: '' }, // TODO setup icons
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

<style scoped>

</style>
