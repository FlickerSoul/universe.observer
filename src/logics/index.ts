import { useDark } from '@vueuse/core'
import dayjs from 'dayjs'
import { nextTick } from 'vue'
import type { Mermaid, RenderResult } from 'mermaid'

export function formatDate(date: string | Date) {
  const day = dayjs(date)
  if (day.year() === dayjs().year())
    return day.format('MMM.DD')
  else
    return day.format('MMM.DD,YYYY')
}

export const isDark = useDark()

/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
export function toggleDark(event: MouseEvent) {
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready
    .then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-out',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
}

function initMermaid(mermaid: Mermaid) {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'default',
  })
}

export async function renderMermaidInPlace() {
  if (document.querySelectorAll('pre.mermaid-content').length === 0)
    return

  const { default: mermaid } = await import('mermaid')

  initMermaid(mermaid)

  await mermaid.run({ nodes: document.querySelectorAll('pre.mermaid-content') })
}

export async function renderMermaidToElement(id: string, content: string): Promise<RenderResult> {
  const { default: mermaid } = await import('mermaid')

  initMermaid(mermaid)

  return await mermaid.render(id, content)
}
