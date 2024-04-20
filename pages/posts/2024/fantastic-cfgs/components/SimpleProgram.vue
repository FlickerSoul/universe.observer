<script setup>
import { onMounted, ref } from 'vue'
import SimpleProgram from '../bril-code/simple-program.json?raw'

import { loadBril, synthesizeMermaid, synthesizeSimpleMermaid } from '../utils/tools'
import { groupBasicBlocks } from '../utils/group-basic-blocks'
import SimpleProgramCode from './SimpleProgramCode.md'
import { renderMermaidToElement } from '~/logics'

const simpleBrilProg = loadBril(SimpleProgram)

const blocks = groupBasicBlocks(simpleBrilProg)

const progMermaid = ref('')
const simplifiedProgMermaid = ref('')

onMounted(async () => {
  progMermaid.value = await renderMermaidToElement('simple-prog-full', synthesizeMermaid(blocks))
  simplifiedProgMermaid.value = await renderMermaidToElement('simple-prog-simplified', synthesizeSimpleMermaid(blocks))
})

const states = ['Simplified', 'Full', 'Code']
const simpleViewToggle = ref(0)
const nextStateIndex = computed(() => (simpleViewToggle.value + 1) % states.length)
const nextState = computed(() => states[nextStateIndex.value])
</script>

<template>
  <div>
    <div
      id="simple-prog-detail-toggle"
      class="cursor-pointer border border-solid border-current inline-block border-rounded px-2 mb-4"
      @click="simpleViewToggle = nextStateIndex"
    >
      {{ `See ${nextState}` }}
    </div>

    <TransitionGroup>
      <div v-if="simpleViewToggle === 0" v-html="simplifiedProgMermaid" />

      <div v-else-if="simpleViewToggle === 1" v-html="progMermaid" />

      <div v-else-if="simpleViewToggle === 2">
        <SimpleProgramCode />
      </div>
    </TransitionGroup>
  </div>
</template>
