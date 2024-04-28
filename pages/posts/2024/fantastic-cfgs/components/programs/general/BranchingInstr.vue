<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import { ProgramDisplayType } from '../../utils'
import BranchingProgram from './code/branching-instr.json?raw'
import ProgramCode from './BranchingInstrCode.md'
</script>

<template>
  <ProgDisplay :prog="BranchingProgram" :init-view="ProgramDisplayType.CFG">
    <ProgramCode />
  </ProgDisplay>
</template>
