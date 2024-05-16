<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '~/logics'

const { name, date, delimiter } = defineProps({
  name: { type: String, required: true },
  date: { type: [String, Date] },
  delimiter: { type: String, default: ' ' },
})

const formattedDate = computed(() => (date ? formatDate(date) : 'N/A'))
</script>

<template>
  <div>
    <span>{{ name }}</span>
    <span>{{ delimiter }}</span>
    <span>{{ formattedDate }}</span>
  </div>
</template>
