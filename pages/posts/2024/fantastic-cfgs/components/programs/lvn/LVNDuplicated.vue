<script setup lang="ts">
import ProgDisplay from '../../ProgDisplay.vue'
import { ProgramDisplayType } from '../../utils'
import ProgramCode from './LVNDuplicated.md'
import BrilCode from './code/lvn-duplicated.json?raw'
</script>

<template>
  <ProgDisplay :prog="BrilCode" :init-view="ProgramDisplayType.PROGRAM" :optionals="{ lvn: true }">
    <ProgramCode />
  </ProgDisplay>
</template>
