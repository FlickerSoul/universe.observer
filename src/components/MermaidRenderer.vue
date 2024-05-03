<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { isDark, renderMermaidToElement, stringHash } from '~/logics'
import Magnifier from '~/components/Magnifier.vue'

const props = defineProps<{
  mermaidContent?: string
}>()
const mermaid = ref<HTMLDivElement | null>(null)
const dest = ref<HTMLDivElement | null>(null)
const svg = ref<string>('')

async function renderMermaid() {
  const mermaidText = props.mermaidContent || mermaid.value?.textContent
  if (!mermaidText)
    return

  if (dest.value) {
    const hash = `msvg-${stringHash(mermaidText).toString()}-${isDark.value ? 'dark' : 'light'}`
    svg.value = await renderMermaidToElement(hash, mermaidText)
  }
}

onMounted(renderMermaid)

watch(isDark, renderMermaid)
</script>

<template>
  <div>
    <div ref="mermaid" class="mermaid-text-compartment">
      <slot />
    </div>
    <Magnifier>
      <div ref="dest" class="mermaid-container" v-html="svg" />
    </Magnifier>
  </div>
</template>

<style lang="sass">
.mermaid-text-compartment
  display: none

div.mermaid-container
  width: 100%
  @apply flex justify-center

  svg
    display: block
    height: 100%
</style>
