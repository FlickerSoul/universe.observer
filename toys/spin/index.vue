<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { main } from './utils'

const canvasContainer = ref()

onMounted(() => {
  main(canvasContainer.value)
})
</script>

<template>
  <div>
    <div id="canvasContainer" ref="canvasContainer" class="ma" style="position: relative;" />
  </div>
</template>

<style lang="sass">
#canvasContainer
  height: 512px
  width: 512px
</style>
