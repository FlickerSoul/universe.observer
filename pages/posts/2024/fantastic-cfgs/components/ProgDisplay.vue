<script setup lang="ts">
import { computed, defineProps, onMounted, ref } from 'vue'
import { loadBril, synthesizeMermaid, synthesizeSimpleMermaid } from '../utils/tools'
import { groupBasicBlocks } from '../utils/group-basic-blocks'
import { renderMermaidToElement } from '~/logics'
import Magnifier from '~/components/Magnifier.vue'

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
  <div class="">
    <div
      class="cursor-pointer mb-2 flex justify-center"
      @click="viewToggle = nextStateIndex"
    >
      <span class="border border-solid border-current border-rounded inline-block px-2">
        {{ `See ${nextState}` }}
      </span>
    </div>

    <div>
      <div v-if="viewToggle === 0">
        <slot />
      </div>

      <Magnifier v-else-if="viewToggle === 1">
        <div class="flex justify-center" v-html="simplifiedProgMermaid" />
      </Magnifier>

      <Magnifier v-else-if="viewToggle === 2">
        <div class="flex justify-center" v-html="progMermaid" />
      </Magnifier>
    </div>
  </div>
</template>
