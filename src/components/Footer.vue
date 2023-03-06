<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="mb-15 post-center">
    <hr class="mt-20 mb-5">

    <div v-if="route.path !== '/'" class="my-8">
      <router-link
        :to="route.path.split('/').slice(0, -1).join('/') || '/'"
        class="font-mono no-underline opacity-50 hover:opacity-90"
      >
        cd ..
      </router-link>
    </div>
    <a
      target="_blank"
      class="text-sm  opacity-50 hover:opacity-90 mt-7"
      href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
    >
      CC BY-NC-SA 4.0
    </a>
    <span class="text-sm opacity-50">
      2023 - PRESENT © Larry Z | Built With <span style="display: inline-block; color: #cd0006" class="i-mdi-heart" />
    </span>
  </div>
</template>
