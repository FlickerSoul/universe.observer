<script setup lang="ts">
import { ref } from 'vue'

const isOverlayOpen = ref(false)
const zoomLevel = ref(1)
const position = ref({ x: 0, y: 0 })
let isPanning = false
const start = { x: 0, y: 0 }

function openOverlay() {
  isOverlayOpen.value = true
}

function closeOverlay() {
  isOverlayOpen.value = false
  zoomLevel.value = 1
  position.value = { x: 0, y: 0 }
}

function zoomIn() {
  zoomLevel.value *= 1.1
}

function zoomOut() {
  zoomLevel.value /= 1.1
}

function startPan(event: MouseEvent) {
  isPanning = true
  start.x = event.clientX - position.value.x
  start.y = event.clientY - position.value.y
}

function pan(event: MouseEvent) {
  if (!isPanning)
    return
  position.value.x = event.clientX - start.x
  position.value.y = event.clientY - start.y
}

function endPan() {
  isPanning = false
}

function handleWheel(event: WheelEvent) {
  event.preventDefault()
  if (event.deltaY < 0)
    zoomIn()
  else
    zoomOut()
}
</script>

<template>
  <div class="image-wrapper" @click="openOverlay">
    <slot />
  </div>

  <div v-show="isOverlayOpen" class="img-overlay" @click.self="closeOverlay">
    <div class="controls ma flex gap-4">
      <div @click="zoomIn">
        <i class="i-mdi-zoom-in mag-icon" />
      </div>
      <div @click="zoomOut">
        <i class="i-mdi-zoom-out mag-icon" />
      </div>
      <div @click="closeOverlay">
        <i class="i-mdi-close mag-icon" />
      </div>
    </div>
    <div
      class="image-container"
      :style="{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})` }"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel="handleWheel"
      @dblclick="zoomIn"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="sass">
.image-wrapper
  cursor: zoom-in

.img-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  background-color: rgba(0, 0, 0, 0.8)
  z-index: 1999

  .controls
    position: absolute
    top: 20px
    z-index: 2000

    div
      cursor: pointer

      .mag-icon
        display: inline-block
        height: 24px
        width: 24px

  .image-container
    cursor: grab

    &:active
      cursor: grabbing
</style>
