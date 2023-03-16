<script setup lang="ts">
import { isDark } from '../logics'
import DarkToggle from './DarkToggle.vue'
</script>

<template>
  <header class="header font-mono">
    <router-link class="" to="/">
      <div class="logo">
        <img v-show="!isDark" src="/logo-black-lower.svg" alt="site logo">
        <img v-show="isDark" src="/logo-white-lower.svg" alt="site logo">
      </div>
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="flex flex-row flex-nowrap gap-7 items-center">
        <router-link to="/">
          <span class="lt-md:hidden">Home</span>
        </router-link>
        <router-link to="/posts">
          <span class="lt-md:hidden">Posts</span>
          <div class="md:hidden i-mdi-book-settings-outline nav-icon " />
        </router-link>
        <router-link to="/toys">
          <span class="lt-md:hidden">Toys</span>
          <div class="md:hidden i-mdi-nintendo-game-boy nav-icon" />
        </router-link>
        <router-link to="/portfolio">
          <span class="lt-md:hidden">Portfolio</span>
          <div class="md:hidden i-mdi-briefcase-outline nav-icon" />
        </router-link>
        <a href="https://github.com/FlickerSoul" target="_blank" title="GitHub" class="nav-icon">
          <div class="i-mdi-github-box" />
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
  &>img
    width: 64px

.nav
  padding: 2rem
  width: 100%
  display: grid
  grid-template-columns: auto max-content
  box-sizing: border-box
  .nav-icon
    scale: 1.4
</style>
