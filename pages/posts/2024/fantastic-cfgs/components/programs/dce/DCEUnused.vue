<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import SimpleProgram from './code/dce-unused.json?raw'
import DCEUnused from './DCEUnused.md'

import Pass from './op-passes/unused'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram" :optionals="{ dce: Pass }">
    <DCEUnused />
  </ProgDisplay>
</template>
