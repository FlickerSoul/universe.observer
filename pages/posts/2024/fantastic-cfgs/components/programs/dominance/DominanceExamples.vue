<script setup lang="ts">
import ProgCycle from '../../ProgCycle.vue'
import StrictDominance from './StrictDominance.vue'
import Dominance from './Dominance.vue'
import LoopDominance from './LoopDominance.vue'
import StrictLoopDominance from './StrictLoopDominance.vue'

const progMapping = {
  dominance: Dominance,
  'strict dominance': StrictDominance,
  'dominance of loop': LoopDominance,
  'strict dominance of loop': StrictLoopDominance,
} as const

const progs = Array.from(Object.values(progMapping))
const names = Array.from(Object.keys(progMapping))
</script>

<template>
  <ProgCycle :progs="progs" :names="names" />
</template>
