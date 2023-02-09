<script setup lang="ts">
const { abstract } = defineProps({ abstract: { type: String, default: 'No Abstract...' } })
</script>

<template>
  <div>
    {{ abstract }}
  </div>
</template>
