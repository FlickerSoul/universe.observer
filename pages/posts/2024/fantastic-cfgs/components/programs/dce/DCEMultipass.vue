<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import DCEMultiPassProgram from './code/dce-multipass.json?raw'
import DCEMultiPass from './DCEMultipass.md'
</script>

<template>
  <ProgDisplay :prog="DCEMultiPassProgram">
    <DCEMultiPass />
  </ProgDisplay>
</template>
