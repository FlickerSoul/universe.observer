<script setup lang="ts">
import type { ISkillItem } from './types'

const { skill } = defineProps<{ skill: ISkillItem }>()
</script>

<template>
  <li>
    <a v-if="skill.url" :href="skill.url" target="_blank"> {{ skill.name }} </a>
    <span v-else> {{ skill.name }} </span>
    <span v-if="skill.note"> ({{ skill.note }})</span>
  </li>
</template>
