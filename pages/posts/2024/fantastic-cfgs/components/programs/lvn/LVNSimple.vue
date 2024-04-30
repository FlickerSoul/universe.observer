<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import { ProgramDisplayType } from '../../utils'
import ProgramCode from './LVNSimple.md'
import BrilCode from './code/lvn-simple.json?raw'
</script>

<template>
  <ProgDisplay :prog="BrilCode" :init-view="ProgramDisplayType.PROGRAM">
    <ProgramCode />
  </ProgDisplay>
</template>
