<script setup lang="ts">
import { isDark } from '../logics'
function toggleDark() {
  isDark.value = !isDark.value
}
</script>

<template>
  <a title="Toggle Dark Theme" style="cursor: pointer" @click="toggleDark">
    <div v-show="isDark" class="i-mdi-white-balance-sunny" />
    <div v-show="!isDark" class="i-mdi-moon-waning-crescent" />
  </a>
</template>
