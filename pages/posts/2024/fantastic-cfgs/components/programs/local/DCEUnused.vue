<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import SimpleProgram from './code/dce-unused.json?raw'
import DCEUnused from './DCEUnused.md'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram">
    <DCEUnused />
  </ProgDisplay>
</template>
