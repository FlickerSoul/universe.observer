<script setup lang="ts">
import { computed } from 'vue'

const { abstract } = defineProps<{ abstract: string }>()
const abstractContent = computed(() => abstract === undefined ? '' : abstract)
</script>

<template>
  <div>
    {{ abstractContent }}
  </div>
</template>
