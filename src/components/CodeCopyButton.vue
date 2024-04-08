<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

const parent = ref<HTMLDivElement>()
const copyStatus = ref<boolean | undefined>(undefined)

function copyParentText() {
  const codeNode: HTMLPreElement | null | undefined
    = parent.value?.parentElement?.parentElement?.querySelector('pre.shiki')
  if (codeNode?.textContent) {
    const { isSupported, copy } = useClipboard()
    if (!isSupported) {
      window.alert('Clipboard copying is not supported on this device.')
      copyStatus.value = false
    }

    copy(codeNode.textContent)
    copyStatus.value = true
  }

  setTimeout(() => {
    copyStatus.value = undefined
  }, 1000)
}
</script>

<template>
  <div ref="parent" class="copy-button cursor-pointer" @click="copyParentText">
    <div
      class="copy-icon"
      :class="[copyStatus === undefined ? 'i-mdi-content-copy' : (copyStatus ? 'i-mdi-check' : 'i-mdi-error')]"
    />
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
