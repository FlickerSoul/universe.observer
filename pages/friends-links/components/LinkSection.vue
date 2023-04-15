<script setup lang="ts">
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import type { IFriendLink } from './types'
import LinkCard from './LinkCard.vue'

defineProps({
  name: { type: String, required: true },
  links: { type: Object as PropType<IFriendLink[]> },
})
</script>

<template>
  <div v-if="links && links.length > 0" class="link-section">
    <h2>{{ name }}</h2>
    <div class="link-container">
      <LinkCard
        v-for="(link, i) in links"
        :key="i"
        :link="link"
        class="link-card"
      />
    </div>
  </div>
</template>

<style scoped lang="sass">
.link-container
  display: flex
  flex-wrap: wrap
  gap: 1rem
  .link-card
    max-width: 400px
</style>
