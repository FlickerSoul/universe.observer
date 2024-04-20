<script setup lang="ts">
import SimpleProgram from '../bril-code/simple-program.json?raw'
import SimpleProgramCode from './SimpleProgramCode.md'
import ProgDisplay from './ProgDisplay.vue'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram">
    <SimpleProgramCode />
  </ProgDisplay>
</template>
