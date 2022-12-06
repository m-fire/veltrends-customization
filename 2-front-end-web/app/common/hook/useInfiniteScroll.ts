import { RefObject, useCallback, useEffect, useState } from 'react'

export function useInfiniteScroll(ref: RefObject<any>, fetchNext: () => void) {
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          fetchNext()
        })
      },
      {
        root: ref.current.parentElement,
        rootMargin: '300px',
        threshold: 1,
      },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [fetchNext, ref])
}
