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
    <ul class="skill-listing">
      <SkillItem
        v-for="skill in skills.skills"
        :key="skill.name"
        :skill="skill"
      />
    </ul>
  </div>
</template>

<style lang="sass" scoped>
@media print
  .skill-listing
    margin-bottom: 0.5em
    display: flex
    flex-direction: row
    flex-wrap: wrap
    gap: 0.7em
    & li
      &:before
        content: '| '
      display: inline-block
      &:after
        content: ' '
</style>
