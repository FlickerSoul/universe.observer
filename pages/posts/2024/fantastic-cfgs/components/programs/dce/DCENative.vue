<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import DCENativeProgram from './code/dce-native.json?raw'
import DCENative from './DCENative.md'
</script>

<template>
  <ProgDisplay :prog="DCENativeProgram">
    <DCENative />
  </ProgDisplay>
</template>
