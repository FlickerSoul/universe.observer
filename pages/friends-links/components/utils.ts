import { ref, shallowRef } from 'vue'

export const isLocked = ref(false)
export const cursor = shallowRef<HTMLDivElement>()

let rect: DOMRect | undefined

export function moveCursor(event: MouseEvent) {
  if (isLocked.value)
    return

  const { x, y } = event
  cursor.value?.style.setProperty('--cursor-top', `${y}px`)
  cursor.value?.style.setProperty('--cursor-left', `${x}px`)
}

export function compOnEnter(event: MouseEvent) {
  isLocked.value = true

  const target = event.target as HTMLDivElement

  if (cursor.value) {
    rect = target.getBoundingClientRect()

    cursor.value.classList.add('is-locked')
    cursor.value.style.setProperty('--cursor-top', `${rect.top - 2}px`)
    cursor.value.style.setProperty('--cursor-left', `${rect.left - 5}px`)
    cursor.value.style.setProperty('--cursor-width', `${rect.width + 10}px`)
    cursor.value.style.setProperty('--cursor-height', `${rect.height + 4}px`)

    target.style.setProperty('--hover-scale', '1.05')
  }
}

export function compOnLeave(event: MouseEvent) {
  isLocked.value = false

  if (cursor.value) {
    cursor.value.style.setProperty('--hover-translateX', null)
    cursor.value.style.setProperty('--hover-translateY', null)
    cursor.value.style.setProperty('--cursor-width', null)
    cursor.value.style.setProperty('--cursor-height', null)

    setTimeout(() => {
      if (!isLocked.value)
        cursor.value!.classList.remove('is-locked')
    }, 100)
  }

  const target = event.target as HTMLDivElement | null
  if (target) {
    target.style.setProperty('--hover-translateX', null)
    target.style.setProperty('--hover-translateY', null)
    target.style.setProperty('--hover-scale', '1')
  }
}

export function compOnMove(event: MouseEvent) {
  const target = event.target as HTMLDivElement | null
  if (cursor.value && rect && target) {
    const halfHeight = rect.height / 2
    const topOffset = (event.y - rect.top - halfHeight) / halfHeight
    const halfWidth = rect.width / 2
    const leftOffset = (event.x - rect.left - halfWidth) / halfWidth

    cursor.value.style.setProperty('--hover-translateX', `${leftOffset * 6}px`)
    cursor.value.style.setProperty('--hover-translateY', `${topOffset * 5}px`)

    target.style.setProperty('--hover-translateX', `${leftOffset * 4}px`)
    target.style.setProperty('--hover-translateY', `${topOffset * 3}px`)
  }
}

export function parOnEnter() {
  if (cursor.value) {
    cursor.value?.style.setProperty('--cursor-width', '0.2em')
    cursor.value?.style.setProperty('--cursor-height', '1.2rem')
  }
}

export function parOnLeave() {
  if (cursor.value) {
    cursor.value?.style.setProperty('--cursor-width', null)
    cursor.value?.style.setProperty('--cursor-height', null)
  }
}

export function parOnPressed() {
  if (isLocked.value)
    return
  cursor.value?.style.setProperty('--hover-scale', '0.9')
}

export function parOnReleased() {
  if (isLocked.value)
    return
  cursor.value?.style.setProperty('--hover-scale', '1')
}
