<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  progs: object[]
}>()

const index = ref(0)
const displayed = computed(() => {
  if (props.progs.length === 0)
    return null
  else
    return props.progs[index.value]
})

function next() {
  index.value = (index.value + 1) % props.progs.length
}

function prev() {
  index.value = (index.value - 1 + props.progs.length) % props.progs.length
}

const isFlickering = ref(false)

function triggerFlicker() {
  if (isFlickering.value)
    return

  isFlickering.value = true
  setTimeout(() => {
    isFlickering.value = false // Turn off the flicker after the animation completes
  }, 1500) // Ensure this duration matches the total animation time
}

const el = ref<HTMLDivElement | null>(null)

function display(number: number) {
  index.value = number
  el.value?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  triggerFlicker()
}

defineExpose({
  display,
})
</script>

<template>
  <div ref="el" class="my-4">
    <div class="flex flex-row gap-2 justify-center mb-4">
      <div class="cursor-pointer" @click.stop="prev">
        ⬅️
      </div>
      <div>
        <span :class="{ flicker: isFlickering }">{{ index + 1 }}</span> / {{ props.progs.length }}
      </div>
      <div class="cursor-pointer" @click.stop="next">
        ➡️
      </div>
    </div>
    <div class="w-100%">
      <component :is="displayed" />
    </div>
  </div>
</template>

<style scoped lang="sass">
@keyframes flickerAnimation
  0%
    opacity: 1
  50%
    opacity: 0
  100%
    opacity: 1

.flicker
  animation-name: flickerAnimation
  animation-duration: 1s
  animation-iteration-count: 4
  animation-timing-function: ease-in-out
</style>
