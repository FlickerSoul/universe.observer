<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  progs: object[]
  names?: string[]
}>()

const index = ref(0)

function next() {
  index.value = (index.value + 1) % props.progs.length
}

function prev() {
  index.value = (index.value - 1 + props.progs.length) % props.progs.length
}

const isFlickering = ref(false)

function triggerFlicker() {
  if (isFlickering.value) return

  isFlickering.value = true
  setTimeout(() => {
    isFlickering.value = false // Turn off the flicker after the animation completes
  }, 1500) // Ensure this duration matches the total animation time
}

const el = ref<HTMLDivElement | null>(null)

function display(number: number) {
  index.value = number
  el.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  })
  triggerFlicker()
}

defineExpose({
  display,
})
</script>

<template>
  <div ref="el" class="my-4">
    <div class="mb-4 flex flex-col gap-1">
      <div class="flex flex-row gap-2 justify-center">
        <div class="cursor-pointer" @click.stop="prev">⬅️</div>
        <div>
          <span :class="{ flicker: isFlickering }">{{ index + 1 }}</span> /
          {{ props.progs.length }}
        </div>
        <div class="cursor-pointer" @click.stop="next">➡️</div>
      </div>
      <div
        v-if="names !== undefined"
        :class="{ flicker: isFlickering }"
        class="text-center"
      >
        {{ names[index] }}
      </div>
    </div>
    <div class="w-100%">
      <component
        :is="prog"
        v-for="(prog, i) in progs"
        v-show="index === i"
        :key="i"
      />
    </div>
  </div>
</template>
