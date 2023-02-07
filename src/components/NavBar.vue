<script setup lang="ts">
import DarkToggle from './DarkToggle.vue'
</script>

<template>
  <header class="header font-mono">
    <router-link class="" to="/">
      <div class="logo">
        <img src="/vite.svg" alt="site log">
      </div>
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="links">
        <router-link to="/">
          <span>Home</span>
        </router-link>
        <div />
        <router-link to="/posts">
          <span>Posts</span>
        </router-link>
        <div />
        <router-link to="/portfolio">
          <span>Portfolio</span>
        </router-link>
        <div />
        <a href="https://github.com/FlickerSoul" target="_blank" title="GitHub" class="nav-icon">
          <div class="i-uil-github-alt" />
        </a>
        <DarkToggle class="nav-icon" />
      </div>
    </nav>
  </header>
</template>

<style scoped lang="sass">
.header
  margin-bottom: 0

.logo
  position: absolute
  left: 1.5rem
  top: 1.5rem

.nav
  padding: 2rem
  width: 100%
  display: grid
  grid-template-columns: auto max-content
  box-sizing: border-box
  .links
    display: grid
    grid-auto-flow: column
    grid-gap: 0.6rem
    &>div
      display: inline-block
</style>
