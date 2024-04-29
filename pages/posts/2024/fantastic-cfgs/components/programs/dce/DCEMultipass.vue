<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import DCEMultiPassProgram from './code/dce-multipass.json?raw'
import DCEMultiPass from './DCEMultipass.md'

import DCEMultipassPasses from './op-passes/multipass/dce-multipass'
</script>

<template>
  <ProgDisplay :prog="DCEMultiPassProgram" :optionals="{ dce: DCEMultipassPasses }">
    <DCEMultiPass />
  </ProgDisplay>
</template>
