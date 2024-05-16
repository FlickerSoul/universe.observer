<script setup lang="ts">
import ProgCycle from '../../ProgCycle.vue'
import StrictDominance from './StrictDominance.vue'
import Dominance from './Dominance.vue'

const progMapping = {
  dominance: Dominance,
  'strict dominance': StrictDominance,
} as const

const progs = Array.from(Object.values(progMapping))
const names = Array.from(Object.keys(progMapping))
</script>

<template>
  <ProgCycle :progs="progs" :names="names" />
</template>
