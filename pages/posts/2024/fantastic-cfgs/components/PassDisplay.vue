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
  <MagicMove v-if="codePasses !== undefined" lang="bril" :codes="codePasses" />

  <CompiledMagicMove v-else-if="compiledPasses !== undefined" :steps="compiledPasses" />

  <div v-else>
    Error: No passes provided
  </div>
</template>
