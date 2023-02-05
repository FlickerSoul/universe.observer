<script setup lang="ts">
import { isDark } from '../logics'
function toggleDark() {
  isDark.value = !isDark.value
}
</script>

<template>
  <a class="nav-icon" title="Toggle Dark Theme" @click="toggleDark">
    <div v-show="isDark" class="i-system-uicons-sun" />
    <div v-show="!isDark" class="i-system-uicons-moon" />
  </a>
</template>

<style scoped lang="sass">
.nav-icon:hover
  cursor: pointer
</style>
