<script setup lang="ts">
import { ShikiMagicMove } from 'shiki-magic-move/vue'
import { computed, defineExpose, ref } from 'vue'

import type { MagicMoveDifferOptions, MagicMoveRenderOptions } from 'shiki-magic-move/types'
import { CustomHighlighter as highlighter } from '~/logics/highlighter'

import { isDark } from '~/logics'
import CycleOperator from '~/components/CycleOperator.vue'
import HighlighterWrapper from '~/components/HighlighterWrapper.vue'

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
  lineNumbers: true,
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
</script>

<template>
  <div>
    <HighlighterWrapper :lang="lang">
      <ShikiMagicMove
        :highlighter="highlighter"
        :lang="lang"
        :code="code"
        :theme="usedTheme"
        :options="processedOptions"
      />
    </HighlighterWrapper>
    <CycleOperator
      class="mt-1"
      :can-prev="canPrev" :next="next" :can-next="canNext" :prev="prev" :total-steps="codes.length" :step="index"
    />
  </div>
</template>

<style lang="sass">
@import "shiki-magic-move/dist/style.css"
.shiki-magic-move-container
  @apply w-fit of-hidden border-rounded-12px font-mono h-max px-1.2em py-0.5em box-border min-w-100% m0
</style>
