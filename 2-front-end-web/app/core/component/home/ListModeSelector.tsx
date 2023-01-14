import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link } from '@remix-run/react'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import produce from 'immer'
import qs from 'qs'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { ItemListMode } from '~/core/api/types'
import { Calendar, Clock, Fire } from '~/core/component/generate/svg'
import { DateStringRange } from '~/common/util/converters'
import { Filters, Flex, Font } from '~/common/style/css-builder'
import { Media } from '~/common/style/media-query'

type ModeSelectorProps = {
  currentMode: ItemListMode
  dateRange: DateStringRange
}

function ListModeSelector({ currentMode, dateRange }: ModeSelectorProps) {
  const [itemStates, setItemStates] = useState<ModeItemProps['state'][]>([
    {
      mode: 'trending',
      name: '트렌딩',
      icon: <Fire />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: linkByMode('trending'),
    },
    {
      mode: 'recent',
      name: '최신',
      icon: <Clock />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: linkByMode('recent'),
    },
    {
      mode: 'past',
      name: '과거',
      icon: <Calendar />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: linkByMode('past', dateRange),
    },
  ])

  const currentIndex = useMemo(
    () => itemStates.findIndex((s) => s.mode === currentMode),
    [itemStates, currentMode],
  )
  const { indicatorLeft, indicatorWidth } = useIndicatorState(currentIndex)

  useEffect(() => {
    if (currentMode == 'past') {
      setItemStates((prev) =>
        produce(prev, (next) => {
          next[currentIndex].linkTo = linkByMode(currentMode, dateRange)
        }),
      )
    }
  }, [dateRange])

  const onUpdateItemStates: ModeItemProps['onUpdateItemState'] = useCallback(
    (itemIndex, itemState, itemEl) => {
      setItemStates((prev) =>
        produce(prev, (next) => {
          const indicatorMarginWidth = 5
          next[itemIndex].size = {
            ...itemState.size,
            width: itemEl.offsetWidth + indicatorMarginWidth,
          }
          next[itemIndex].position = {
            ...itemState.position,
            left: itemEl.offsetLeft - indicatorMarginWidth / 3,
          }
        }),
      )
    },
    [],
  )

  return (
    <Block>
      <SelectorList>
        {itemStates.map((s, index) => (
          <ListModeItem
            key={s.name}
            index={index}
            currentMode={currentMode}
            state={s}
            onUpdateItemState={onUpdateItemStates}
          />
        ))}

        {indicatorWidth > 0 ? (
          <Indicator
            layout
            style={{
              width: indicatorWidth,
              left: indicatorLeft,
            }}
          />
        ) : null}
      </SelectorList>
    </Block>
  )

  /* refactor */

  function linkByMode(mode: ItemListMode, range?: DateStringRange) {
    const paramsMap = mode == 'past' ? { mode, ...range } : { mode }
    return '/'.concat(qs.stringify(paramsMap, { addQueryPrefix: true }))
  }

  function useIndicatorState(itemIndex: number) {
    const indicatorLeft = useMemo(
      () => itemStates[itemIndex].position.left,
      [itemIndex, itemStates],
    )
    const indicatorWidth = itemStates[itemIndex].size.width

    return {
      indicatorLeft,
      indicatorWidth,
    }
  }
}
export default ListModeSelector

// Inner Components

const Block = styled.div`
  ${Media.minWidth.desktop} {
    display: none;
  }
`

const SelectorList = styled.nav`
  ${Flex.container().create()};
  //position: relative;
  gap: 24px;
  ${Filters.filter()
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .create()};
`

const Indicator = styled(motion.div)`
  position: absolute;
  height: 3px;
  border-radius: 99px;
  background: ${appColors.primary1};
  left: 0;
  bottom: -8px;
  ${Filters.filter()
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .create()};
`

// Inner function component

type ModeItemProps = {
  index: number
  currentMode: ItemListMode
  state: ModeItemState
  onUpdateItemState: (
    itemIndex: number,
    itemState: ModeItemState,
    itemEl: HTMLElement,
  ) => void
}
type ModeItemState = {
  mode: ItemListMode
  name: string
  icon: ReactNode
  size: { width: number }
  position: { left: number }
  linkTo: string
}

export function ListModeItem({
  index,
  currentMode,
  state,
  onUpdateItemState,
}: ModeItemProps) {
  const { mode: itemMode, linkTo, name, icon } = state
  /* Link 이동 후 re-render 될때 Item state 업데이트 로직 실행 */

  // useLayoutEffect(() => {
  useEffect(() => {
    const linkEl = modeLinkRef.current
    if (!linkEl) return

    onUpdateItemState(index, state, linkEl)
  }, [index, onUpdateItemState])

  const modeLinkRef = useRef<HTMLAnchorElement>(null)

  return (
    <StyledLink to={linkTo} ref={modeLinkRef} active={currentMode === itemMode}>
      {icon} {name}
    </StyledLink>
  )
}

const StyledLink = styled(Link)<{ active: boolean }>`
  ${Flex.container().alignItems('flex-end').create()};
  ${Font.style()
    .size(14)
    .weight(700)
    .color(globalColors.grey4)
    // .lineHeight(1.5)
    .textDecoration('none')
    .create()};
  cursor: pointer;
  ${({ active }) =>
    active &&
    css`
      color: ${appColors.primary1};
      pointer-events: none;
    `}
  svg {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
`
