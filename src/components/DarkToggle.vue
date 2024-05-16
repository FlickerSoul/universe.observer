<script setup lang="ts">
import { isDark, toggleDark } from '~/logics'
</script>

<template>
  <div
    class="inline-block"
    title="Toggle Dark Theme"
    style="cursor: pointer"
    @click="toggleDark"
  >
    <div v-show="isDark" class="i-mdi-white-balance-sunny" />
    <div v-show="!isDark" class="i-mdi-moon-waning-crescent" />
  </div>
</template>
