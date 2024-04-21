<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import BranchingProgram from './code/branching-instr.json?raw'
import ProgramCode from './BranchingInstrCode.md'
</script>

<template>
  <ProgDisplay :prog="BranchingProgram" :init-view="2">
    <ProgramCode />
  </ProgDisplay>
</template>
