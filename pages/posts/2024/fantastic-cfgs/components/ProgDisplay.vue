<script setup lang="ts">
import { defineProps, nextTick, onMounted, ref } from 'vue'
import { loadBril, synthesizeMermaid, synthesizeSimpleMermaid } from '../utils/tools'
import { groupBasicBlocks } from '../utils/group-basic-blocks'
import type { OptionalDisplays } from './utils'
import { ProgramDisplayType, addDisplays, programDisplayTypeToName } from './utils'
import PassDisplay from './PassDisplay.vue'
import LVNDisplay from './LVNDisplay.vue'
import { renderMermaidToElement } from '~/logics'
import Magnifier from '~/components/Magnifier.vue'

const { prog, initView, optionals } = defineProps<{
  prog: string
  initView?: ProgramDisplayType
  optionals?: OptionalDisplays
}>()

const simpleBrilProg = loadBril(prog)

const blocks = groupBasicBlocks(simpleBrilProg)

const progMermaid = ref('')
const simplifiedProgMermaid = ref('')

onMounted(async () => {
  await nextTick()
  progMermaid.value = await renderMermaidToElement('simple-prog-full', synthesizeMermaid(blocks))
  simplifiedProgMermaid.value = await renderMermaidToElement('simple-prog-simplified', synthesizeSimpleMermaid(blocks))
})

const states = addDisplays(
  [ProgramDisplayType.PROGRAM, ProgramDisplayType.CFG, ProgramDisplayType.CFG_BASIC_BLOCKS],
  optionals,
)

const viewToggle = ref<ProgramDisplayType>(initView ?? ProgramDisplayType.PROGRAM)
</script>

<template>
  <div>
    <div
      class="mb-2 flex justify-center"
    >
      <span
        v-for="state in states" :key="state"
        class="border border-solid border-current border-rounded inline-block px-2 mx-1 cursor-pointer"
        @click="viewToggle = state"
      >
        {{ `See ${programDisplayTypeToName(state)}` }}
      </span>
    </div>

    <div>
      <slot v-if="viewToggle === ProgramDisplayType.PROGRAM" />

      <Magnifier v-if="viewToggle === ProgramDisplayType.CFG">
        <div class="flex justify-center" v-html="progMermaid" />
      </Magnifier>

      <Magnifier v-if="viewToggle === ProgramDisplayType.CFG_BASIC_BLOCKS">
        <div class="flex justify-center" v-html="simplifiedProgMermaid" />
      </Magnifier>

      <PassDisplay v-if="optionals?.dce" v-show="viewToggle === ProgramDisplayType.DCE" :code-passes="optionals?.dce" />

      <LVNDisplay v-if="optionals?.lvn" v-show="viewToggle === ProgramDisplayType.LVN" :prog="simpleBrilProg" />
    </div>
  </div>
</template>
