import {
  forwardRef,
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
import { useDisplayEffectRef } from '~/common/hook/useDisplayEffectRef'

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
    },
    {
      mode: 'recent',
      name: '최신',
      icon: <Clock />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: getDateRangeLinkTo('recent'),
    },
    {
      mode: 'past',
      name: '과거',
      icon: <Calendar />,
      size: { width: 0 },
      position: { left: 0 },
      linkTo: getDateRangeLinkTo('past', dateRange),
    },
  ])

  // 필독: Ref 를 State 안에 가두면, mutable 한 Ref 마져도 immutable 객체로 변하기 때문에
  // 향후, RefObject 메모리해제 시 애러가 발생된다.
  // msg: Cannot assign to read only property 'current' of object...
  // 이에 따라, state 에 포함됬던 ref 를 따로 빼내어 mutable 하게 관리되어야 한다.
  const itemRefs = itemStates.map(() => useRef<HTMLAnchorElement | null>(null))

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
  const displayRef = useDisplayEffectRef<HTMLAnchorElement>(
    {
      displayHandler: () => {
        const margin = INDICATOR_MIN_WIDTH
        setItemStates((prev) =>
          produce(prev, (next) => {
            next.forEach((s, i) => {
              const el = itemRefs[i].current
              if (!el) return
              s.size.width = el.offsetWidth + margin
              s.position.left = el.offsetLeft - margin / 3
            })
          }),
        )
      },
    },
    [],
  )

  return (
    <NavBlock ref={displayRef} {...rest}>
      <ItemList>
        {itemStates.map((s, index) => {
          return (
            <Item key={s.mode}>
              <LinkByMode
                currentMode={currentMode}
                state={s}
                ref={itemRefs[index]}
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

type ModeItemProps = {
  currentMode: ItemListMode
  state: {
    mode: ItemListMode
    name: string
    icon: ReactNode
    size: { width: number }
    position: { left: number }
    linkTo: string
  }
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
