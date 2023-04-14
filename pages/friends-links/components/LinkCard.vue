<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { PropType } from 'vue'
import type { IFriendLink } from './types'

const props = defineProps({
  link: { type: Object as PropType<IFriendLink>, required: true },
  cursor: { type: Object as PropType<HTMLDivElement> },
  locked: { type: Boolean, required: true },
})

const emits = defineEmits(['update:locked'])

const cursor = computed(() => props.cursor)
let rect: DOMRect | undefined
let timeoutTimer: number | undefined

const isLocked = computed({
  get() { return props.locked },
  set(v) {
    clearTimeout(timeoutTimer)
    emits('update:locked', v)
  },
})

function compOnEnter(event: MouseEvent) {
  const target = event.target as HTMLDivElement

  isLocked.value = true

  if (cursor.value) {
    rect = target.getBoundingClientRect()

    cursor.value.classList.add('is-locked')
    cursor.value.style.setProperty('--cursor-top', `${rect.top}px`)
    cursor.value.style.setProperty('--cursor-left', `${rect.left}px`)
    cursor.value.style.setProperty('--cursor-width', `${rect.width}px`)
    cursor.value.style.setProperty('--cursor-height', `${rect.height}px`)

    target.style.setProperty('--hover-scale', '1.02')
  }
}

function compOnLeave(event: MouseEvent) {
  isLocked.value = false

  if (cursor.value) {
    cursor.value.style.setProperty('--cursor-width', null)
    cursor.value.style.setProperty('--cursor-left', null)
    cursor.value.style.setProperty('--cursor-width', null)
    cursor.value.style.setProperty('--cursor-height', null)
    cursor.value.style.setProperty('--hover-translateX', null)
    cursor.value.style.setProperty('--hover-translateY', null)
    cursor.value.classList.remove('is-locked')
    timeoutTimer = setTimeout(() => {
      if (!isLocked.value)
        cursor.value!.classList.remove('is-locked')
    }, 50)
  }

  const target = event.target as HTMLDivElement | null
  if (target) {
    target.style.setProperty('--hover-translateX', null)
    target.style.setProperty('--hover-translateY', null)
    target.style.setProperty('--hover-scale', '1')
  }
}

function compOnMove(event: MouseEvent) {
  const target = event.target as HTMLDivElement | null
  if (cursor.value && rect && target) {
    const halfHeight = rect.height / 2
    const topOffset = (event.y - rect.top - halfHeight) / halfHeight
    const halfWidth = rect.width / 2
    const leftOffset = (event.x - rect.left - halfWidth) / halfWidth

    cursor.value.style.setProperty('--hover-translateX', `${leftOffset * 6}px`)
    cursor.value.style.setProperty('--hover-translateY', `${topOffset * 5}px`)

    target.style.setProperty('--hover-translateX', `${leftOffset * 4}px`)
    target.style.setProperty('--hover-translateY', `${topOffset * 3}px`)
  }
}

function parOnEnter() {
  if (cursor.value) {
    cursor.value?.style.setProperty('--cursor-width', '0.2em')
    cursor.value?.style.setProperty('--cursor-height', '0.9em')
  }
}

function parOnLeave() {
  if (cursor.value) {
    cursor.value?.style.setProperty('--cursor-width', null)
    cursor.value?.style.setProperty('--cursor-height', null)
  }
}
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
        v-for="(about, i) in link.about" :key="i"
        @mouseenter="parOnEnter"
        @mouseleave="parOnLeave"
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
  display: inline-block
  border-radius: 15px
  transition: box-shadow 0.7s ease, opacity 0.1s ease-out
  @apply: pa-4
  &:hover
    box-shadow: 0 0 40px 5px rgba(109, 109, 109, 0.4)
  .moving-comp
    display: inline-block
    --hover-scale: 1
    --hover-translateX: 0
    --hover-translateY: 0
    transform: translate(var(--hover-translateX), var(--hover-translateY)) scale(var(--hover-scale))
</style>
