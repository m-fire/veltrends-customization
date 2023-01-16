import { useEffect, RefObject } from 'react'

export type ClickAndTouchEvent = MouseEvent | TouchEvent

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handleClickOutside: (event: ClickAndTouchEvent) => void,
) {
  const listener = (event: ClickAndTouchEvent) => {
    const element = ref?.current
    if (!element || element.contains(event?.target as Node)) {
      return
    }
    handleClickOutside(event) // 클릭이 전달된 ref 외부에 있는 경우에만 처리기를 호출합니다.
  }

  useEffect(() => {
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handleClickOutside]) // 참조 또는 핸들러가 변경된 경우에만 다시 로드
}
