<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import DCENativeProgram from './code/dce-native.json?raw'
import DCENative from './DCENative.md'
import Pass from './op-passes/native'
</script>

<template>
  <ProgDisplay :prog="DCENativeProgram" :optionals="{ dce: Pass }">
    <DCENative />
  </ProgDisplay>
</template>
