import { useEffect, useMemo, useReducer } from 'react'
import { formatDistanceToNow } from 'date-fns'
import ko from 'date-fns/locale/ko'

export function useDateDistance(past: string | Date) {
  const [value, rerender] = useReducer((state) => !state, false)

  useEffect(() => {
    const interval = setInterval(() => {
      rerender()
    }, 1000 * 60)
    return () => clearInterval(interval)
  }, [])

  const distanceText = useMemo(() => {
    const pastDate = past instanceof Date ? past : new Date(past)
    const pastDistance = Date.now() - pastDate.getTime()
    if (pastDistance < 60 * 1000) {
      return '방금 전' // date-fns 의 '1분 미만전' text 대체
    }

    return formatDistanceToNow(pastDate, {
      locale: ko,
      addSuffix: true,
    })
  }, [past, value])

  return distanceText
}
