<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { isDark, renderMermaidToElement } from '~/logics'
import Magnifier from '~/components/Magnifier.vue'

const props = defineProps<{
  mermaidContent?: string
}>()

const uid = getCurrentInstance()?.uid ?? Math.floor(Math.random() * 10e10)

const mermaid = ref<HTMLDivElement | null>(null)
const dest = ref<HTMLDivElement | null>(null)
const svg = ref<string>('')

async function renderMermaid() {
  const mermaidText = props.mermaidContent || mermaid.value?.textContent
  if (!mermaidText)
    return

  if (dest.value) {
    const hash = `msvg-${uid}-${isDark.value ? 'dark' : 'light'}`
    const result = await renderMermaidToElement(hash, mermaidText)
    svg.value = result.svg
    result.bindFunctions?.(dest.value)
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
