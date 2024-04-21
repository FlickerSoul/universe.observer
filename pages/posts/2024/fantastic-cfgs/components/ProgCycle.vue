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
</script>

<template>
  <div>
    <div class="flex flex-row gap-2 justify-center">
      <div class="cursor-pointer" @click.stop="prev">
        ⬅️
      </div>
      <div>
        {{ index + 1 }} / {{ props.progs.length }}
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
