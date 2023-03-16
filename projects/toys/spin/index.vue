<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { main } from './utils'

const canvasContainer = ref()

const lines = `
The world spins around in shades of green,
Life blossoms forth, a vibrant scene.
A symphony of colors, a sight to be seen,
Composed upon each blade, a masterpiece serene.

Red, the color of passion and fire,
A burst of energy, a fierce desire.
It illuminates the darkness, never to tire,
Composed upon the sky, a spectacle entire.

Blue, the color of the endless sky,
A vast expanse, a reason to fly.
It holds the promise of tomorrow, a lullaby,
Composed upon the water, a tranquil sigh.

Life is but a canvas, colors ever-changing,
A masterpiece in motion, forever arranging.
Each hue a brushstroke, endlessly ranging,
Composed upon the soul, a never-ending painting.
`.split('\n')

onMounted(() => {
  main(canvasContainer.value)
})
</script>

<template>
  <div class="post-center">
    <div class="mb-3">
      <h1>Spin</h1>
      <p v-for="(line, i) in lines" :key="i" class="font-mono my-1 leading-none">
        {{ line }}
      </p>
    </div>
    <div>
      <div id="canvasContainer" ref="canvasContainer" class="ma" style="position: relative;" />
    </div>
  </div>
</template>

<style lang="sass">
#canvasContainer
  aspect-ratio: 1/1
</style>
