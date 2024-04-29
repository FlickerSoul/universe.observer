<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import DCEMultiPassProgram from './code/dce-multipass.json?raw'
import DCEMultiPass from './DCEMultipass.md'

import Pass from './op-passes/multipass'
</script>

<template>
  <ProgDisplay :prog="DCEMultiPassProgram" :optionals="{ dce: Pass }">
    <DCEMultiPass />
  </ProgDisplay>
</template>
