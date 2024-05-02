<script setup lang="ts">
import type { Program } from '../utils/types'
import { groupBasicBlocksForFun } from '../utils/group-basic-blocks'
import { applyLVNForBlock } from '../utils/lvn'
import { brilProgramToText, funcBlocksToFunc } from '../utils/bril-txt'
import MagicMove from '~/components/MagicMove.vue'

const props = defineProps<{ prog: Program }>()

const originalProg = brilProgramToText(props.prog)

const lvnProg = {
  functions: props.prog.functions.map((func) => {
    const blocks = groupBasicBlocksForFun(func).map((block) => {
      applyLVNForBlock(block)
      return block
    })

    return funcBlocksToFunc(func.name, blocks, func.args, func.type, func.pos)
  }),
} as Program

const codes = [brilProgramToText(lvnProg), originalProg]
</script>

<template>
  <MagicMove lang="bril" :codes="codes" />
</template>
