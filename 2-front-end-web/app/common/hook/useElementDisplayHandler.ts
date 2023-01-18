import { RefObject, useEffect } from 'react'

/**
 * <h2>useElementDisplayHandler</h2>
 * <p>CSS display: none 값에 의해 element 가 표시되거나, 사라짐 에 따라 동작하는 display 핸들링 훅</p>
 * <ol>
 *     <li>주의사항</li>
 *     <ul>
 *         <li>콜백함수는 반드시 re-render 될때 새로 생성되서는 아니된다.
 *         내부적으로 useEffect 의 의존배열에 callback 함수가 등록되어있는데,
 *         인수로 넘어온 callback 함수가 랜더링 때마다 매번 생성되어 인자로 받게되면,
 *         핸들러들은 무한반복 실행을 하게 될 것이다. 따라서 useCallback 으로 생성제한을 두어야 한다.</li>
 *     </ul>
 * </ol>
 * @param ref HTMLElement 기반 RefObject
 * @param displayHandler Element 가 표시될때 1번 호출될 함수
 * @param undisplayHandler Element 가 사라질때 1번 호출될 함수
 */
export function useElementDisplayHandler<T extends HTMLElement>(
  ref: RefObject<T>,
  displayHandler: () => void,
  undisplayHandler?: () => void,
) {
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!ref.current || !e.isIntersecting) {
          undisplayHandler?.()
          return
        }

        displayHandler()
      })
    })
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, displayHandler, undisplayHandler])
}
