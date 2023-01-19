import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

/**
 * React 전용 useEffect 와 IntersectionObserver 의 조합으로 동작하는 무한스크롤 기능 훅 함수.
 * 참고: inifinity scroll(무한 스크롤) 기능이란? 추가 데이터를 로딩을 위한
 * 데이터 fetch 트리거 위치를 Ref 로 정한 HTMLElement 를 화면에 배치된 이후
 * 스크롤 중에 보여지게 될 때, 데이터를 로딩하는 기술을 뜻한다. 이를 통해
 * 추가로딩 된 데이터를 기존의 데이터 목록의 다음 목록으로 붙여 넣고, 이런 과정을
 * 스크롤을 통해 데이터가 붙여지도록 동작시키는 것을 "무한 스크롤" 이라고 한다.
 * @param ref useRef<T>() 반환타입
 * @param trigger
 */
export function useInfiniteScroll(ref: RefObject<any>, trigger: () => void) {
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          trigger()
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
  }, [trigger, ref])
}

/**
 * 기존의 useInfiniteScroll 에 더한 react-query 의 flag 및 fetch 함수를 인자로 받고
 * 교차영역확인용 HTMLElement Ref 를 반환하는 간소화된 "무한스크롤" 훅의 확장 훅이다.
 * 반환값인 Ref 를 지정하는 즉시, 그 element 가 보여질때 바로 다음 데이터를 로딩하게 된다.
 * @param hasNextPage
 * @param fetchNextPage
 */
export function useInfinityScrollTriggerRef<E extends HTMLElement>({
  hasNextPage,
  fetchNextPage,
}: Pick<
  Partial<ReturnType<typeof useInfiniteQuery>>,
  'hasNextPage' | 'fetchNextPage'
>) {
  /* 무한 스크롤 로딩 Ref 및 기능정의 */
  const ref = useRef<E | null>(null)

  const fetchNext = useCallback(() => {
    if (hasNextPage === false) return
    fetchNextPage?.()
  }, [hasNextPage, fetchNextPage])

  useInfiniteScroll(ref, fetchNext)
  return ref
}
