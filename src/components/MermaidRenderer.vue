<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import { renderMermaidToElement } from '~/logics'
import Magnifier from '~/components/Magnifier.vue'

const props = defineProps<{
  mermaidContent?: string
}>()

const uid = getCurrentInstance()?.uid ?? Math.floor(Math.random() * 10e10)

const mermaid = ref<HTMLDivElement | null>(null)
const dark = ref<HTMLDivElement | null>(null)
const light = ref<HTMLDivElement | null>(null)

const darkSvg = ref<string>('')
const lightSvg = ref<string>('')

async function renderMermaid() {
  const mermaidText = props.mermaidContent || mermaid.value?.textContent
  if (!mermaidText) return

  if (dark.value) {
    const hash = `msvg-${uid}-dark`
    const result = await renderMermaidToElement(hash, mermaidText, true)
    darkSvg.value = result.svg
    result.bindFunctions?.(dark.value)
  }

  if (light.value) {
    const hash = `msvg-${uid}-light`
    const result = await renderMermaidToElement(hash, mermaidText, false)
    lightSvg.value = result.svg
    result.bindFunctions?.(light.value)
  }
}

onMounted(renderMermaid)
</script>

<template>
  <div>
    <div ref="mermaid" class="mermaid-text-compartment">
      <slot />
    </div>
    <Magnifier>
      <div ref="dark" class="mermaid-container dark-mermaid" v-html="darkSvg" />
    </Magnifier>

    <Magnifier>
      <div
        ref="light"
        class="mermaid-container light-mermaid"
        v-html="lightSvg"
      />
    </Magnifier>
  </div>
</template>

<style lang="sass">
.mermaid-text-compartment
  display: none

html:not(.dark) .dark-mermaid
  display: none

html.dark .light-mermaid
  display: none

div.mermaid-container
  width: 100%
  @apply flex justify-center

  svg
    display: block
    height: 100%
</style>
