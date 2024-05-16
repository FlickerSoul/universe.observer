<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const { abstract } = defineProps({
  abstract: { type: String, default: 'No Abstract...' },
})

const md = MarkdownIt()
const displayedAbstract = computed(() => md.render(abstract))
</script>

<template>
  <div v-html="displayedAbstract" />
</template>
