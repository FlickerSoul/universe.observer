<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

const parent = ref<HTMLDivElement>()
function copyParentText() {
  const codeNode: HTMLPreElement | null | undefined
    = parent.value?.parentElement?.parentElement?.querySelector('pre.shiki')
  if (codeNode?.textContent) {
    const { isSupported, copy } = useClipboard()
    copy(codeNode.textContent)
    if (!isSupported)
      window.alert('Clipboard copying is not supported on this device.')
  }
}
</script>

<template>
  <div ref="parent" class="copy-button">
    <div class="i-mdi-content-copy" style="cursor: pointer;" @click="copyParentText" />
  </div>
</template>

<style scoped lang="sass">
.copy-button
  padding: 0.2em
  transition: border 0.25s
  --border-color: transparent
  border: 1px solid var(--border-color)
  border-radius: 4px
  &:hover
    --border-color: rgba(179, 179, 179, 0.7)
</style>
