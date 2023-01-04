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
import { ItemListMode } from '~/core/api/types'
import { Calendar, Clock, Fire } from '~/core/component/generate/svg'
import { DateStringRange } from '~/common/util/converters'
import Flex from '~/common/style/css-flex'
import Font from '~/common/style/css-font'

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
  position: sticky;
  ${Flex.Container.style().justifyContent('center').create()};
  top: 0;

  padding-top: 8px;
  padding-bottom: 24px;
  margin-bottom: 8px;
  margin-left: -20px;
  margin-right: -20px;
  z-index: 1;

  backdrop-filter: blur(8px); // grayscale(80%)
  -webkit-backdrop-filter: blur(8px); // grayscale(80%)
`

const SelectorList = styled.nav`
  ${Flex.Container.style().create()};
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

  -webkit-filter: drop-shadow(0px 0px 0.5px white)
    drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white);
  filter: drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white)
    drop-shadow(0px 0px 0.5px white);
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
  ${Flex.Container.style().alignItems('flex-end').create()};
  ${Font.style()
    .size('14px')
    .weight(700)
    .color(colors.grey4)
    // .lineHeight(1.5)
    .create()};
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
