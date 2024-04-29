<script setup lang="ts">
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import { getHighlighter } from 'shiki'
import { computed, defineExpose, ref } from 'vue'

import type { MagicMoveDifferOptions, MagicMoveRenderOptions } from 'shiki-magic-move/types'
import brilJson from '../../scripts/bril-textmate.json?raw'
import { isDark } from '~/logics'

type Option = MagicMoveRenderOptions & MagicMoveDifferOptions

const props = withDefaults(defineProps<{
  options?: Option
  codes: string[]
  defaultIndex: number
  lang: string
}>(), {
  defaultIndex: 0,
})

const DEFAULT_OPTIONS = {
  lineNumbers: 'on',
  duration: 500,
  stagger: 10,
  enhanceMatching: true,
  animationContainer: true,
}

const processedOptions = computed(() => {
  return {
    ...DEFAULT_OPTIONS,
    ...(props.options ?? {}),
  } as Option
})

const usedTheme = computed(() => isDark.value ? 'nord' : 'rose-pine-dawn')

const index = ref(props.defaultIndex)
const code = computed(() => props.codes[index.value])

const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < props.codes.length - 1)

function next() {
  if (canNext.value)
    index.value = (index.value + 1) % props.codes.length
}

function prev() {
  if (canPrev.value)
    index.value = (index.value - 1 + props.codes.length) % props.codes.length
}

defineExpose({
  next,
  prev,
})

const bril = JSON.parse(brilJson)

const highlighter = await getHighlighter({
  themes: ['nord', 'rose-pine-dawn'],
  langs: ['typescript', 'c++', 'python', 'markdown', 'latex', 'swift', 'kotlin', bril],
})
</script>

<template>
  <div>
    <div class="flex gap-2 justify-center">
      <div :class="{ 'control-button': canPrev }" @click="prev">
        {{ canPrev ? '⬅️' : '⛔️' }}
      </div>
      <div>
        <span>{{ index + 1 }}</span> / {{ props.codes.length }}
      </div>
      <div :class="{ 'control-button': canNext }" @click="next">
        {{ canNext ? '➡️' : '⛔️' }}
      </div>
    </div>
    <div class="of-auto">
      <ShikiMagicMove
        :highlighter="highlighter"
        :lang="lang"
        :code="code"
        :theme="usedTheme"
        :options="processedOptions"
      />
    </div>
  </div>
</template>

<style lang="sass">
@import "shiki-magic-move/dist/style.css"
.shiki-magic-move-container
  @apply w-fit of-hidden border-rounded-12px font-mono h-max px-1.2em py-0.5em box-border min-w-100% m0
</style>

<style scoped lang="sass">
.control-button
  @apply cursor-pointer
</style>
