import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import produce from 'immer'
import { colors } from '~/common/style/colors'
import { ListMode } from '~/core/api/types'
import { Calendar, Clock, Fire } from '~/core/component/generate/svg'
import { flexStyles, fontStyles } from '~/common/style/styled'

type ListModeSelectorProps = {
  mode: ListMode
  onSelectMode(mode: ListMode): void
}

function ListModeSelector({ mode, onSelectMode }: ListModeSelectorProps) {
  const modeStateList = useMemo(
    () =>
      [
        {
          mode: 'trending',
          name: '트렌딩',
          icon: <Fire />,
        },
        {
          mode: 'recent',
          name: '최신',
          icon: <Clock />,
        },
        {
          mode: 'past',
          name: '과거',
          icon: <Calendar />,
        },
      ] as const,
    [],
  )
  const currentIndex = useMemo(
    () => modeStateList.findIndex((s) => s.mode === mode),
    [modeStateList, mode],
  )

  const [itemStates, setItemStates] = useState<SelectorItemState[]>([
    { size: { width: 0 }, position: { left: 0 } },
    { size: { width: 0 }, position: { left: 0 } },
    { size: { width: 0 }, position: { left: 0 } },
  ])
  const indicatorLeft = useMemo(
    () => itemStates[currentIndex].position.left,
    [currentIndex, itemStates],
  )
  const indicatorWidth = itemStates[currentIndex].size.width

  const setItemSizeOfIndex: SelectorItemProps['onUpdateState'] = useCallback(
    (index: number, stateOfIndex) => {
      setItemStates((prevState) =>
        produce(prevState, (draft) => {
          draft[index] = stateOfIndex
        }),
      )
    },
    [],
  )

  return (
    <Block>
      <ModeNavigator>
        {modeStateList.map((state, index) => (
          <NavigatorItem
            index={index}
            key={state.name}
            currentMode={mode}
            modeState={state}
            onSelectMode={onSelectMode}
            onUpdateState={setItemSizeOfIndex}
          />
        ))}
        {indicatorWidth === 0 ? null : (
          <Indicator
            layout
            style={{
              width: indicatorWidth,
              left: indicatorLeft,
            }}
          />
        )}
      </ModeNavigator>
    </Block>
  )
}
export default ListModeSelector

// Inner Components

const Block = styled.div`
  position: sticky;
  ${flexStyles({ justifyContent: 'center' })};
  top: 0;
  // todo: 가로 사이즈가 꽉 차도록 수정
  padding-top: 8px;
  padding-bottom: 16px;
  margin-bottom: 16px;

  backdrop-filter: grayscale(80%) blur(8px);
  -webkit-backdrop-filter: grayscale(80%) blur(8px);
  z-index: 1;
`

const ModeNavigator = styled.nav`
  ${flexStyles()};
  position: relative;
  gap: 24px;
`

const Indicator = styled(motion.div)`
  height: 3px;
  background: ${colors.primary1};
  position: absolute;
  left: 0;
  bottom: -8px;
  border-radius: 99px;
`

// Inner Function Component

type SelectorItemProps = {
  index: number
  currentMode: ListMode
  modeState: {
    mode: ListMode
    name: string
    icon: ReactNode
  }
  onSelectMode: ListModeSelectorProps['onSelectMode']
  onUpdateState(index: number, state: SelectorItemState): void
}

type SelectorItemState = {
  size: { width: number }
  position: { left: number }
}

/**
 * Inner function component
 */
function NavigatorItem({
  index,
  currentMode,
  modeState: { mode, name, icon },
  onSelectMode,
  onUpdateState,
}: SelectorItemProps) {
  const modeItemRef = useRef<HTMLDivElement>(null)

  /* ref: https://medium.com/@jnso5072/react-useeffect-%EC%99%80-uselayouteffect-%EC%9D%98-%EC%B0%A8%EC%9D%B4%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C-e1a13adf1cd5
   * useEffect 대신 useLayoutEffect 를 사용해야 하는 상황:
   * useEffect 사용시 발생하는 first-rendering -> re-rendering 사이의 깜빡거림 때문에
   * 첫 painting 시 조건에 따라 state 가 다르게 렌더링 해야 한다면 useLayoutEffect 사용 */
  // useLayoutEffect(() => {
  useEffect(() => {
    const itemEl = modeItemRef.current
    if (!itemEl) return

    const marginWidth = 8
    onUpdateState(index, {
      size: { width: itemEl.offsetWidth + marginWidth },
      position: { left: itemEl.offsetLeft - marginWidth / 2 },
    })
  }, [onUpdateState, index])

  return (
    <ModeItem
      ref={modeItemRef}
      isActive={mode === currentMode}
      onClick={() => onSelectMode(mode)}
    >
      {icon} {name}
    </ModeItem>
  )
}

const ModeItem = styled.div<{ isActive?: boolean }>`
  ${flexStyles({ alignItems: 'flex-end' })};
  ${fontStyles({
    size: '14px',
    color: colors.grey4,
    weight: 700,
    // lineHeight: 1.5,
  })};
  ${(props) =>
    props.isActive &&
    css`
      color: ${colors.primary1};
    `}

  svg {
    //width: 20px;
    height: 20px;
    margin-right: 4px;
  }
`
