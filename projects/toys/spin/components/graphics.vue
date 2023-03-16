<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { main } from './utils'

const canvasContainer = ref()

onMounted(() => {
  main(canvasContainer.value)
})
</script>

<template>
  <div id="canvasContainer" ref="canvasContainer" class="ma" style="position: relative;" />
</template>

<style lang="sass">
#canvasContainer
  aspect-ratio: 1/1
</style>
