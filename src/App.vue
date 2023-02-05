<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
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
