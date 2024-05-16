<script setup lang="ts">
import CodeCopyButton from '~/components/CodeCopyButton.vue'

defineProps<{
  lang: string
}>()
</script>

<template>
  <!-- TODO: add a way to not hard code style -->
  <div
    class="code-container"
    style="
      --shiki-dark: #d8dee9ff;
      --shiki-light: #575279;
      --shiki-dark-bg: #2e3440ff;
      --shiki-light-bg: #faf4ed;
    "
  >
    <div class="shiki-extra-before flex gap-3 items-center">
      <span class="font-mono">{{ lang }}</span>
      <div style="flex-grow: 1" />
      <CodeCopyButton />
    </div>
    <div class="code-container-wrapper">
      <slot />
    </div>
  </div>
</template>
