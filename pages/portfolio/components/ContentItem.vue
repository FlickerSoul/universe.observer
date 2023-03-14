<script setup lang="ts">
import type { IContentItem } from './types'

const { content } = defineProps<{
  content: IContentItem
}>()
</script>

<template>
  <div>
    <div class="mb-1">
      <div class="text-5 serif-font leading-none cv-content-title">
        {{ content.title }}
      </div>
      <div v-if="content.startDate">
        <span> {{ content.startDate }} </span>  <span v-if="content.endDate"> -- {{ content.endDate }} </span>
      </div>
    </div>
    <div v-if="content.role || content.url" class="flex flex-row leading-none" style="justify-content: space-between;">
      <div>
        {{ content.role }}
      </div>
      <div v-if="content.url" class="text-3">
        <a :href="content.url" target="_blank">{{ content.url }}</a>
      </div>
    </div>
    <div v-if="content.techStack" class="text-sm font-mono">
      {{ content.techStack.join("\u2009|\u2009") }}
    </div>
    <div>
      <ul>
        <li v-for="des in content.descriptions" :key="des" v-html="des" />
      </ul>
    </div>
  </div>
</template>
