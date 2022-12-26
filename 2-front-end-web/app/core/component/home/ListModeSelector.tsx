import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link } from '@remix-run/react'
import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import produce from 'immer'
import qs from 'qs'
import { colors } from '~/common/style/colors'
import { ListMode } from '~/core/api/types'
import { Calendar, Clock, Fire } from '~/core/component/generate/svg'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { DateStringRange } from '~/common/util/converters'

type ModeSelectorProps = {
  currentMode: ListMode
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

  const currentIndex = useMemoCurrentItemIndex()
  const { indicatorLeft, indicatorWidth } = useIndicatorState(currentIndex)

  useEffectToUpdatePastSelectorLinkDate(currentIndex)

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
          <ModeItem
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

  function useEffectToUpdatePastSelectorLinkDate(index: number) {
    useEffect(() => {
      if (currentMode == 'past') {
        setItemStates((prev) =>
          produce(prev, (next) => {
            next[index].linkTo = linkByMode(currentMode, dateRange)
          }),
        )
      }
    }, [dateRange])
  }

  function useMemoCurrentItemIndex() {
    return useMemo(
      () => itemStates.findIndex((s) => s.mode === currentMode),
      [itemStates, currentMode],
    )
  }

  function linkByMode(mode: ListMode, range?: DateStringRange) {
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
  position: sticky;
  ${flexStyles({ justifyContent: 'center' })};
  top: 0;

  // todo: 가로 사이즈가 꽉 차도록 수정
  padding-top: 8px;
  padding-bottom: 16px;
  margin-bottom: 16px;

  backdrop-filter: grayscale(80%) blur(4px);
  -webkit-backdrop-filter: grayscale(80%) blur(4px);
  z-index: 1;
`

const SelectorList = styled.nav`
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

// Inner function component

type ModeItemProps = {
  index: number
  currentMode: ListMode
  state: ModeItemState
  onUpdateItemState: (
    itemIndex: number,
    itemState: ModeItemState,
    itemEl: HTMLElement,
  ) => void
}
type ModeItemState = {
  mode: ListMode
  name: string
  icon: ReactNode
  size: { width: number }
  position: { left: number }
  linkTo: string
}

export function ModeItem({
  index,
  currentMode,
  state,
  onUpdateItemState,
}: ModeItemProps) {
  const { mode: itemMode, linkTo, name, icon } = state
  /* Link 이동 후 re-render 될때 Item state 업데이트 로직 실행 */

  useEffect(() => {
    // useLayoutEffect(() => {
    const linkEl = modeLinkRef.current
    if (!linkEl) return
    onUpdateItemState(index, state, linkEl)
  }, [index, onUpdateItemState])

  const modeLinkRef = useRef<HTMLAnchorElement>(null)

  return (
    <StyledLink
      to={linkTo}
      ref={modeLinkRef}
      active={String(itemMode === currentMode) as 'true' | 'false'}
    >
      {icon} {name}
    </StyledLink>
  )
}

const StyledLink = styled(Link)<{ active?: 'true' | 'false' }>`
  ${flexStyles({ alignItems: 'flex-end' })};
  ${fontStyles({
    size: '14px',
    color: colors.grey4,
    weight: 700, // lineHeight: 1.5,
  })};
  text-decoration: none;
  ///* white border 처리 */
  -webkit-filter: drop-shadow(0px 0px 0.5px white)
    drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white)
    drop-shadow(0px 0px 0.5px white);
  filter: drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white)
    drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white);

  ${({ active }) =>
    active === 'true'
      ? css`
          color: ${colors.primary1};
          pointer-events: none;
        `
      : css``}
  svg {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
`
