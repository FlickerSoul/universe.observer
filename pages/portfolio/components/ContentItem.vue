<script setup lang="ts">
import type { IContentItem } from './types'

const { content } = defineProps<{
  content: IContentItem
}>()
</script>

<template>
  <div>
    <div>
      <div class="text-5">
        {{ content.title }}
      </div>
      <div v-if="content.startDate">
        <span> {{ content.startDate }} </span>  <span v-if=content.endDate> -- {{content.endDate}} </span>
      </div>
    </div>
    <div class="flex flex-row text-sm" style="justify-content: space-between;">
      <div> 
        {{ content.role }}
      </div>
      <div v-if="content.url"> 
        <a :href="content.url" target="_blank" >{{ content.url }}</a>
      </div>
    </div>
    <div v-if="content.techStack" class="text-sm font-mono">
      {{ content.techStack.join("|") }}
    </div>
    <div>
      <ul>
        <li v-for="des in content.descriptions" :key="des">
          {{ des }}
        </li>
      </ul>
    </div>
  </div>
</template>
