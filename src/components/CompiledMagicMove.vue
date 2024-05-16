<script setup lang="ts">
import { computed, defineExpose, ref } from 'vue'

import type { KeyedTokensInfo } from 'shiki-magic-move/types'
import { ShikiMagicMovePrecompiled } from 'shiki-magic-move/vue'
import CycleOperator from '~/components/CycleOperator.vue'
import HighlighterWrapper from '~/components/HighlighterWrapper.vue'

const props = withDefaults(
  defineProps<{
    steps: KeyedTokensInfo[]
    defaultIndex?: number
  }>(),
  {
    defaultIndex: 0,
  },
)

const step = ref(props.defaultIndex)

function next() {
  step.value = (step.value + 1) % props.steps.length
}

function prev() {
  step.value = (step.value - 1 + props.steps.length) % props.steps.length
}

const canPrev = computed(() => step.value > 0)
const canNext = computed(() => step.value < props.steps.length - 1)

defineExpose({
  next,
  prev,
})
</script>

<template>
  <div>
    <HighlighterWrapper lang="">
      <ShikiMagicMovePrecompiled :steps="steps" :step="step" />
    </HighlighterWrapper>
    <CycleOperator
      class="mt-1"
      :can-prev="canPrev"
      :next="next"
      :can-next="canNext"
      :prev="prev"
      :total-steps="steps.length"
      :step="step"
    />
  </div>
</template>

<style lang="sass">
@import "shiki-magic-move/dist/style.css"
.shiki-magic-move-container
  @apply w-fit of-hidden border-rounded-12px font-mono h-max px-1.2em py-0.5em box-border min-w-100%
</style>
