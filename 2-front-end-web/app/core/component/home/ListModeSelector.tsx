import {
  forwardRef,
  ReactNode,
  RefObject,
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
import { useElementDisplayHandler } from '~/common/hook/useElementDisplayHandler'

type ModeSelectorProps = {
  currentMode: ItemListMode
  dateRange: DateStringRange
}

const INDICATOR_MIN_WIDTH = 5

function ListModeSelector({
  currentMode,
  dateRange,
  ...rest
}: ModeSelectorProps) {
  //todo: Navigator 모델은 향후 컴포넌트 외부에서 관리해주어야 확장성을 확보한다.
  const [itemStates, setItemStates] = useState<ModeItemProps['state'][]>([
    {
      mode: 'trending',
      name: '트렌딩',
      icon: <Fire />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: getDateRangeLinkTo('trending'),
      itemRef: useRef<HTMLAnchorElement>(null),
    },
    {
      mode: 'recent',
      name: '최신',
      icon: <Clock />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: getDateRangeLinkTo('recent'),
      itemRef: useRef<HTMLAnchorElement>(null),
    },
    {
      mode: 'past',
      name: '과거',
      icon: <Calendar />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: getDateRangeLinkTo('past', dateRange),
      itemRef: useRef<HTMLAnchorElement>(null),
    },
  ])

  const currentIndex = useMemo(
    () => itemStates.findIndex((s) => s.mode === currentMode),
    [itemStates, currentMode],
  )
  const { indicatorLeft, indicatorWidth } = useIndicatorState(currentIndex)

  // dateRange 가 변할떄 마다 따라 linkTo 값을 바꿔주어야 한다.
  useEffect(() => {
    if (currentMode == 'past') {
      setItemStates((prev) =>
        produce(prev, (next) => {
          next[currentIndex].linkTo = getDateRangeLinkTo(currentMode, dateRange)
        }),
      )
    }
  }, [currentMode, dateRange])

  // Indicator 의 너비, 위치 등을 모든 매뉴아이템에게 얻은 후, 이동 시 참조될 값 update.
  // 이 컴포넌트 root element 가 display: none 이 아닐때 실행됨
  const updateStateAfterDisplay = useCallback(() => {
    const marginWidth = INDICATOR_MIN_WIDTH
    setItemStates((prev) =>
      produce(prev, (next) => {
        next.forEach((s) => {
          const el = s.itemRef.current
          if (!el) return

          s.size = {
            ...s.size,
            width: el.offsetWidth + marginWidth,
          }
          s.position = {
            ...s.position,
            left: el.offsetLeft - marginWidth / 3,
          }
        })
      }),
    )
  }, [])

  const rootElementRef = useRef<HTMLElement>(null)
  useElementDisplayHandler(rootElementRef, updateStateAfterDisplay)

  return (
    <NavBlock ref={rootElementRef} {...rest}>
      <ItemList>
        {itemStates.map((s, index) => {
          return (
            <Item key={s.mode}>
              <LinkByMode
                index={index}
                currentMode={currentMode}
                state={s}
                ref={s.itemRef}
              />
            </Item>
          )
        })}
      </ItemList>

      {indicatorWidth > INDICATOR_MIN_WIDTH ? (
        <Indicator
          layout
          style={{
            left: indicatorLeft,
            width: indicatorWidth,
          }}
        />
      ) : null}
    </NavBlock>
  )

  /* refactor */

  function getDateRangeLinkTo(mode: ItemListMode, range?: DateStringRange) {
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

const NavBlock = styled.nav`
  ${Filters.filter()
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .dropShadow(0, 0, 0.5, 'white')
    .create()};
`

const ItemList = styled.ul`
  ${Flex.container().create()};
`

const Item = styled.li`
  width: max-content;
`

const Indicator = styled(motion.div)`
  position: absolute;
  height: 3px;
  border-radius: 99px;
  background: ${appColors.primary1};
  left: 0;
  bottom: -8px;
`

// Inner function component

type ModeItemState = {
  mode: ItemListMode
  name: string
  icon: ReactNode
  size: { width: number }
  position: { left: number }
  linkTo: string
  itemRef: RefObject<HTMLAnchorElement>
}

type ModeItemProps = {
  index: number
  currentMode: ItemListMode
  state: ModeItemState
}

const LinkByMode = forwardRef<HTMLAnchorElement | null, ModeItemProps>(
  ({ currentMode, state }, ref) => {
    const { mode, linkTo, name, icon } = state

    const active = currentMode === mode
    return (
      <StyledLink to={linkTo} active={active.toString()} ref={ref}>
        {icon} {name}
      </StyledLink>
    )
  },
)

const StyledLink = styled(Link)<{ active: string }>`
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
    active === 'true' &&
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
