<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { loadBril, synthesizeMermaid, synthesizeSimpleMermaid } from '../utils/tools'
import { groupBasicBlocks } from '../utils/group-basic-blocks'
import { renderMermaidToElement } from '~/logics'

const { prog, initView } = defineProps<{
  prog: string
  initView?: number
}>()

const simpleBrilProg = loadBril(prog)

const blocks = groupBasicBlocks(simpleBrilProg)

const progMermaid = ref('')
const simplifiedProgMermaid = ref('')

onMounted(async () => {
  progMermaid.value = await renderMermaidToElement('simple-prog-full', synthesizeMermaid(blocks))
  simplifiedProgMermaid.value = await renderMermaidToElement('simple-prog-simplified', synthesizeSimpleMermaid(blocks))
})

const states = ['Code', 'Simplified', 'Full']
const viewToggle = ref(initView || 0)
const nextStateIndex = computed(() => (viewToggle.value + 1) % states.length)
const nextState = computed(() => states[nextStateIndex.value])
</script>

<template>
  <div>
    <div
      class="cursor-pointer border border-solid border-current inline-block border-rounded px-2 mb-4"
      @click="viewToggle = nextStateIndex"
    >
      {{ `See ${nextState}` }}
    </div>

    <TransitionGroup>
      <div v-if="viewToggle === 0">
        <slot />
      </div>

      <div v-else-if="viewToggle === 1" v-html="simplifiedProgMermaid" />

      <div v-else-if="viewToggle === 2" v-html="progMermaid" />
    </TransitionGroup>
  </div>
</template>
