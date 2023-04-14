<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, defineEmits, defineProps } from 'vue'
import type { IFriendLink } from './types'
import LinkCard from './LinkCard.vue'
const props = defineProps({
  name: { type: String, required: true },
  links: { type: Object as PropType<IFriendLink[]> },
  cursor: { type: Object as PropType<HTMLDivElement> },
  locked: { type: Boolean, required: true },
})
const emits = defineEmits(['update:locked'])
const isLocked = computed({
  get() { return props.locked },
  set(v) { emits('update:locked', v) },
})
</script>

<template>
  <div v-if="links && links.length > 0" class="link-section">
    <h2>{{ name }}</h2>
    <div class="link-container">
      <LinkCard
        v-for="(link, i) in links"
        :key="i"
        v-model:locked="isLocked"
        :link="link"
        :cursor="cursor"
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
    max-width: 200px
</style>
