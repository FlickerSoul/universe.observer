<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import SimpleProgram from './code/dce-redef.json?raw'
import DCERedef from './DCERedef.md'

import Pass from './op-passes/redef'
</script>

<template>
  <ProgDisplay :prog="SimpleProgram" :optionals="{ dce: Pass }">
    <DCERedef />
  </ProgDisplay>
</template>
