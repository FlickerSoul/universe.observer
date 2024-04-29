<script setup lang="ts">
import type { KeyedTokensInfo } from 'shiki-magic-move/types'
import MagicMove from '~/components/MagicMove.vue'
import CompiledMagicMove from '~/components/CompiledMagicMove.vue'

defineProps<{
  codePasses?: string[]
  compiledPasses?: KeyedTokensInfo[]
}>()
</script>

<template>
  <Suspense v-if="codePasses !== undefined">
    <MagicMove lang="bril" :codes="codePasses" />
  </Suspense>

  <Suspense v-else-if="compiledPasses !== undefined">
    <CompiledMagicMove :steps="compiledPasses" />
  </Suspense>

  <div v-else>
    Error: No passes provided
  </div>
</template>
