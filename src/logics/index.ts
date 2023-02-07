import { useDark } from '@vueuse/core'
import dayjs from 'dayjs'

export function formatDate(date: Date | string) {
  const day = dayjs(date)
  if (day.year() === dayjs().year())
    return day.format('MMM.DD')
  else
    return day.format('MMM.DD,YYYY')
}

export const isDark = useDark()
