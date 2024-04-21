<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import SimpleProgram from './code/dce-redef.json?raw'
import DCERedef from './DCERedef.md'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram">
    <DCERedef />
  </ProgDisplay>
</template>
