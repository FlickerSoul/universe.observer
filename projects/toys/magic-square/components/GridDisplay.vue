<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { Grid } from './computation'
import { twoDiagonalSum } from './computation'
import type { IResponseWorker, WorkerRequestDataType } from './worker'
import Worker from './worker?worker'
import Magnifier from '~/components/Magnifier.vue'

const grids = ref<Grid[]>([
  [
    [1, 14, 14, 3],
    [11, 7, 6, 9],
    [8, 10, 10, 5],
    [13, 2, 3, 15],
  ],
])

const currentIndex = ref(0)
const numbersArray = computed<Grid | undefined>(() => {
  return grids.value.length > 0 ? grids.value[currentIndex.value] : undefined
})
const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < grids.value.length - 1)

const magicNumber = ref<string>('33')
const gridSize = ref<string>('4')

const features = {
  'Diagonal Sum': twoDiagonalSum,
}

type FeatureKeys = keyof typeof features

const featureToggle: Ref<{ [key in FeatureKeys]: boolean }> = ref({
  'Diagonal Sum': true,
})

const waiting = ref(false)

const worker = new Worker() as IResponseWorker

worker.onmessage = (event) => {
  currentIndex.value = 0
  grids.value = event.data.grids
  waiting.value = false
}

function generateGrid() {
  if (gridSize.value === '' || magicNumber.value === '')
    return

  const msg: WorkerRequestDataType = {
    gridSize: gridSize.value === '' ? null : Number(gridSize.value),
    targetNumber: magicNumber.value === '' ? null : Number(magicNumber.value),
    features: undefined,
  }
  waiting.value = true
  worker?.postMessage(msg)
}

watchDebounced(gridSize, () => {
  generateGrid()
}, { debounce: 1000 })

watchDebounced(magicNumber, () => {
  generateGrid()
},
{ debounce: 1000 })
</script>

<template>
  <div class="relative overflow-hidden">
    <div class="controls flex flex-col mb-5 place-items-center">
      <div>
        <input
          v-model="gridSize" class="number-input" :class="{ 'cursor-not-allowed': waiting }" type="number"
          :disabled="waiting"
        >
        <input
          v-model="magicNumber" class="number-input" :class="{ 'cursor-not-allowed': waiting }" type="number"
          :disabled="waiting"
        >
      </div>
      <div class="flex text-center gap-2 place-items-center">
        <div
          class="control-button"
          :class="canGoPrev ? 'cursor-pointer' : 'cursor-not-allowed'"
          @click="() => { currentIndex = canGoPrev ? currentIndex - 1 : currentIndex }"
        >
          <div class="control-button-icon i-mdi-arrow-upward" />
        </div>
        <div
          class="control-button"
          :class="canGoNext ? 'cursor-pointer' : 'cursor-not-allowed'"
          @click="() => { currentIndex = canGoNext ? currentIndex + 1 : currentIndex }"
        >
          <div class="control-button-icon i-mdi-arrow-downward" />
        </div>

        <div>
          {{ currentIndex + 1 }}/{{ grids.length }}
        </div>

        <div v-if="waiting" class="spinner" />
      </div>
    </div>

    <div class="grid-wrapper flex items-center flex-col gap-5 overflow-auto">
      <Magnifier>
        <div v-if="numbersArray" class="grid-container">
          <div v-for="(row, rowIndex) in numbersArray" :key="rowIndex" class="row">
            <div v-for="(number, numberIndex) in row" :key="numberIndex" class="cell">
              {{ number }}
            </div>
          </div>
        </div>

        <div v-else>
          <p>No solution found</p>
        </div>
      </Magnifier>
    </div>
  </div>
</template>

<style scoped lang="sass">
.grid-container
  display: flex
  flex-direction: column

.row
  display: flex

.cell
  width: 50px
  height: 50px

  display: flex
  justify-content: center
  align-items: center
  border: 1px solid black

.controls
  @apply gap-2 flex-wrap

  .spinner
    border: 4px solid rgba(0, 0, 0, 0.1)
    width: 2em
    height: 2em
    border-radius: 50%
    border-left-color: #007bff
    animation: spin 1s linear infinite

  @keyframes spin
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)

  input[type="number"]
    padding: 8px 12px
    border-radius: 6px
    border: 1px solid #ccc
    outline: none
    transition: border-color 0.3s

    // firefox
    -moz-appearance: textfield

    // safari and chrome
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
      -webkit-appearance: none
      margin: 0

    &:focus
      border-color: #007bff

    &::placeholder
      color: #aaa

  .control-button
    @apply inline-block text-center border border-current border-solid rounded align-middle
    .control-button-icon
      width: 2em
      height: 2em

html.dark
  .cell
    border-color: white

  .number-input
    background-color: black
    color: white
</style>
