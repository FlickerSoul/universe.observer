<script setup lang="ts">
import type { ISkillSection } from './types'
import SkillItem from './SkillItem.vue'

const { skills } = defineProps<{ skills: ISkillSection }>()
</script>

<template>
  <div>
    <div class="text-5 serif-font leading-none">
      {{ skills.name }}
    </div>
    <ul>
      <SkillItem v-for="skill in skills.skills" :key="skill.name" :skill="skill" />
    </ul>
  </div>
</template>
