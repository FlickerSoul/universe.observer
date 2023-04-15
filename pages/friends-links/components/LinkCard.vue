<script setup lang="ts">
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import type { IFriendLink } from './types'
import { compOnEnter, compOnLeave, compOnMove, parOnEnter, parOnLeave, parOnPressed, parOnReleased } from './utils'

defineProps({
  link: { type: Object as PropType<IFriendLink>, required: true },
})
</script>

<template>
  <div class="link-card">
    <div class="link-url">
      <a
        class="moving-comp"
        :href="link.url"
        target="_blank"
        @mouseenter="compOnEnter"
        @mouseleave="compOnLeave"
        @mousemove="compOnMove"
      >
        {{ link.name }}
      </a>
    </div>
    <div v-if="link.about?.length > 0" class="link-about">
      <p
        v-for="(about, i) in link.about"
        :key="i"
        @mouseenter="parOnEnter"
        @mouseleave="parOnLeave"
        @mousedown="parOnPressed"
        @mouseup="parOnReleased"
      >
        {{ about }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="sass">
html.dark
  .link-card:hover
    box-shadow: 0 0 40px 5px rgba(255,255,255,0.4)
.link-card
  border-radius: 15px
  padding: 1rem
  transition: box-shadow 0.7s ease
  &:hover
    box-shadow: 0 0 40px 5px rgba(109, 109, 109, 0.4)
  .link-about
    margin-top: 1em
    p
      margin: 0.25em 0
  .moving-comp
    display: inline-block
    padding: 0 5px
    --hover-scale: 1
    --hover-translateX: 0
    --hover-translateY: 0
    transform: translate(var(--hover-translateX), var(--hover-translateY)) scale(var(--hover-scale))
    &:not(:hover)
      transition-property: transform, opacity
    &:active
      opacity: 0.5
      transform: translate(var(--translateX), var(--translateY)) scale(1)
</style>
