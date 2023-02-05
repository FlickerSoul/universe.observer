<script setup lang="ts">
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'
import type { PropType } from 'vue'
import type { IPostData } from './types'

const { frontmatter } = defineProps({
  frontmatter: {
    type: Object as PropType<IPostData>,
    required: true,
  },
})
const route = useRoute()
</script>

<template>
  <div v-show="frontmatter.title">
    <h1 class="">
      {{ frontmatter.title }}
    </h1>
    <p class="">
      {{ frontmatter.subtitle }}
    </p>
    <p class="">
      {{ frontmatter.createdAt }} - {{ frontmatter.updatedAt }}
    </p>
    <p class="">
      {{ frontmatter.tags }}
    </p>
    <article ref="content">
      <slot />
    </article>

    <div v-if="route.path !== '/'" class="mt-7">
      <router-link
        :to="route.path.split('/').slice(0, -1).join('/') || '/'"
        class="font-mono no-underline opacity-50 hover:opacity-75"
      >
        cd ..
      </router-link>
    </div>
  </div>
</template>
