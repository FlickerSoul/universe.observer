<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
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

const states = ['Code', 'Full', 'Simplified']
const viewToggle = ref(initView ?? 0)
</script>

<template>
  <div class="">
    <div
      class="mb-2 flex justify-center"
    >
      <span
        v-for="(state, idx) in states" :key="state"
        class="border border-solid border-current border-rounded inline-block px-2 mx-1 cursor-pointer"
        @click="viewToggle = idx"
      >
        {{ `See ${state}` }}
      </span>
    </div>

    <div>
      <slot v-if="viewToggle === 0" />

      <Magnifier v-else-if="viewToggle === 1">
        <div class="flex justify-center" v-html="progMermaid" />
      </Magnifier>

      <Magnifier v-else-if="viewToggle === 2">
        <div class="flex justify-center" v-html="simplifiedProgMermaid" />
      </Magnifier>
    </div>
  </div>
</template>
