<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Spin',
})

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

const Graphics = defineAsyncComponent(() => import('./components/graphics.vue'))
</script>

<template>
  <div class="post-center">
    <h1>Spin</h1>
    <div class="mb-10">
      <Graphics />
      <div>
        Loading...
      </div>
    </div>
    <p i18n-lang="en">
      This is a humble simulation of
      <a href="https://www.instagram.com/reel/CodaAl9jhEt/" target="_blank">this post</a>.
      The simulation looks cool but still far from the reality. Trying to figure out how to make it look better.
    </p>
    <p v-for="(line, i) in lines" :key="i" class="font-mono my-1 leading-none">
      {{ line }}
    </p>
  </div>
</template>
