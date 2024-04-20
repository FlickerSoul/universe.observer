<script setup lang="ts">
import BranchingProgram from '../bril-code/branching-instr.json?raw'
import ProgramCode from './BranchingInstrCode.md'
import ProgDisplay from './ProgDisplay.vue'
</script>

<template>
  <ProgDisplay :prog="BranchingProgram" :init-view="2">
    <ProgramCode />
  </ProgDisplay>
</template>
