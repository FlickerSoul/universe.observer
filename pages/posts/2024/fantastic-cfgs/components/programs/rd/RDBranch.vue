<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import ProgCode from './RDBranch.md'
import ProgJson from './code/rd-branch.json?raw'
</script>

<template>
  <ProgDisplay :prog="ProgJson">
    <ProgCode />
  </ProgDisplay>
</template>
