<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import {ProgramDisplayType} from '../../utils'
import Program from './code/dom.json?raw'
import ProgramCode from './Dom.md'
</script>

<template>
  <ProgDisplay :prog="Program" :init-view="ProgramDisplayType.CFG_BASIC_BLOCKS" :optionals="{sdom: true}">
    <ProgramCode/>
  </ProgDisplay>
</template>
