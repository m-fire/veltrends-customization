import { useRef } from 'react'

export default function useFocus<E extends HTMLElement>() {
  const ref = useRef<E | null>(null)

  const focus = (options?: FocusOptions) => {
    const el = ref.current
    el && el.focus(options)
  }

  return [ref, focus] as const

  // Todo: isFocused
  // const isFocused = () => document.activeElement === ref?.current

  // return [ref, focus, isFocused] as const
}
