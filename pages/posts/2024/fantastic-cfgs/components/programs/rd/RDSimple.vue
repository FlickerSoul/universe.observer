<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import ProgCode from './RDSimple.md'
import ProgJson from './code/rd-simple.json?raw'
</script>

<template>
  <ProgDisplay :prog="ProgJson">
    <ProgCode />
  </ProgDisplay>
</template>
