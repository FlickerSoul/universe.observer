<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import SimpleProgram from './code/simple-program.json?raw'
import SimpleProgramCode from './SimpleProgramCode.md'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram">
    <SimpleProgramCode />
  </ProgDisplay>
</template>
