<script setup lang="ts">
import { useRouter } from 'vue-router'

const { tag } = defineProps<{ tag: string }>()
const router = useRouter()

function directToPostList() {
  router.push({ name: 'posts', query: { tag } })
}
</script>

<template>
  <div @click="directToPostList">
    <span>#</span><span>{{ tag }}</span>
  </div>
</template>
