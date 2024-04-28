<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import { ProgramDisplayType } from '../../utils'
import SimpleProgram from './code/simple-program.json?raw'
import SimpleProgramCode from './SimpleProgramCode.md'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram" :init-view="ProgramDisplayType.CFG_BASIC_BLOCKS">
    <SimpleProgramCode />
  </ProgDisplay>
</template>
