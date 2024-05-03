<script setup lang="ts">
import type { Program } from '../utils/types'
import { applyLvnToProgram } from '../utils/lvn'
import { brilProgramToText } from '../utils/bril-txt'
import MagicMove from '~/components/MagicMove.vue'

const props = defineProps<{ prog: Program }>()

const originalProg = brilProgramToText(props.prog)

const lvnProg = applyLvnToProgram(props.prog)

const codes = [originalProg, brilProgramToText(lvnProg)]
</script>

<template>
  <MagicMove lang="bril" :codes="codes" />
</template>
