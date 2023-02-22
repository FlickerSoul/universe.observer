<script setup lang="ts">
const { name } = defineProps({ name: { type: String } })
</script>

<template>
  <div>
    <div>
      Definition: {{ name }}
    </div>
    <slot />
  </div>
</template>
