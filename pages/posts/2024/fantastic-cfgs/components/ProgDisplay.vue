<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { loadBril, synthesizeMermaid, synthesizeSimpleMermaid } from '../utils/tools'
import { groupBasicBlocks } from '../utils/group-basic-blocks'
import { ProgramDisplayType, programDisplayTypeToName } from './utils'
import { renderMermaidToElement } from '~/logics'
import Magnifier from '~/components/Magnifier.vue'

const { prog, initView } = defineProps<{
  prog: string
  initView?: ProgramDisplayType
}>()

const simpleBrilProg = loadBril(prog)

const blocks = groupBasicBlocks(simpleBrilProg)

const progMermaid = ref('')
const simplifiedProgMermaid = ref('')

onMounted(async () => {
  progMermaid.value = await renderMermaidToElement('simple-prog-full', synthesizeMermaid(blocks))
  simplifiedProgMermaid.value = await renderMermaidToElement('simple-prog-simplified', synthesizeSimpleMermaid(blocks))
})

const states = Object.values(ProgramDisplayType)
  .filter(v => typeof v === 'string') as (keyof typeof ProgramDisplayType)[]
const viewToggle = ref<ProgramDisplayType>(initView ?? ProgramDisplayType.PROGRAM)
</script>

<template>
  <div class="">
    <div
      class="mb-2 flex justify-center"
    >
      <span
        v-for="state in states" :key="state"
        class="border border-solid border-current border-rounded inline-block px-2 mx-1 cursor-pointer"
        @click="viewToggle = ProgramDisplayType[state]"
      >
        {{ `See ${programDisplayTypeToName(ProgramDisplayType[state])}` }}
      </span>
    </div>

    <div>
      <slot v-if="viewToggle === ProgramDisplayType.PROGRAM" />

      <Magnifier v-else-if="viewToggle === ProgramDisplayType.CFG">
        <div class="flex justify-center" v-html="progMermaid" />
      </Magnifier>

      <Magnifier v-else-if="viewToggle === ProgramDisplayType.CFG_BASIC_BLOCKS">
        <div class="flex justify-center" v-html="simplifiedProgMermaid" />
      </Magnifier>
    </div>
  </div>
</template>
