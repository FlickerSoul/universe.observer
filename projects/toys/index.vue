<script setup lang="ts">
import type { IToyInfo } from './types'

const toys: IToyInfo[] = [
  { name: 'Spin', url: '/toys/spin' },
]
</script>

<template>
  <div class="post-center">
    <p>
      Here is a list of toys I made :)
    </p>
    <div class="grid grid-cols-5 gap-2">
      <div v-for="(toy, i) in toys" :key="toy.name">
        <span>{{ i }}. </span>
        <a v-if="toy.outside" :href="toy.url">
          {{ toy.name }}
        </a>
        <router-link v-else :to="toy.url">
          {{ toy.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>
