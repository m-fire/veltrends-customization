import React, { ReactNode, useCallback, useMemo, useReducer } from 'react'
import styled, { css } from 'styled-components'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { colors } from '~/core/style/colors'
import {
  Numbers as n,
  RandomNumbers as rn,
  SequenceNumbers as sn,
} from '~/common/util/numbers'
import { Flex } from '~/common/style/css-builder'

export type SequenceElementsTogglerProps = {
  elements: ReactNode[]
  // 시퀀스 방향타입. default: forward
  direction?: SeqDirection
  // 시퀀싱이 시작될 요소의 최초 index
  startIndex?: number
  // 다음 시퀀스 스탭. default: 1
  seqStep?: number
  size?: Size
  disabled?: boolean
  canAnimate?: boolean
  onClick?: () => void
}
type SeqDirection = 'forward' | 'backward' | 'random'
type Size = 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'

function SequenceElementsToggler({
  elements,
  direction = 'forward',
  startIndex = 0,
  seqStep = 1,
  size = 'medium',
  disabled = false,
  // 초기값: disabled=false -> canAnimate=true 또는 반대 설정
  canAnimate = !disabled,
  onClick,
}: SequenceElementsTogglerProps) {
  //
  const initialSeqState = {
    seq:
      direction === 'backward'
        ? elements.length - 1
        : direction === 'random'
        ? rn.randomInt({ bound: elements.length })
        : startIndex, // `forward` 초기 값
    bound: elements.length,
    step: seqStep,
  }

  const [sequenceState, nextSequence] = useReducer(
    (
      state: Pick<typeof initialSeqState, 'seq' | 'bound'>,
      direction: SeqDirection,
    ) => {
      switch (direction) {
        case 'forward':
          return {
            ...state,
            seq: sn.increaseByStepInRange(state),
          }
        case 'backward':
          return {
            ...state,
            seq: sn.decreaseByStepInRange(state),
          }
        case 'random':
          return {
            ...state,
            seq: rn.randomInt(state),
          }
      }
      return state
    },
    initialSeqState,
  )

  // validate states
  const { seq, bound } = sequenceState
  if (seq < 0 || seq >= bound)
    throw new Error(
      `sequence(${seq}) number must equal and greater than 0 or less than children length(${bound})`,
    )
  if (bound < 1) throw new Error(`bound(${bound}) must 1 or more`)

  //
  // useEffect(() => {
  //
  // }, [elements, xxxx]);
  //

  /* Render part */

  const canToggle = !disabled && elements.length > 1

  const mappedElements = useMemo(
    () =>
      elements.map((child) => {
        const hashKey = n.stringToHashCode(`${seq}${child}`)
        return (
          <StyledMotionSpan
            key={hashKey}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {child}
          </StyledMotionSpan>
        )
      }),
    [elements, canAnimate],
  )

  const toggleElements = () => {
    if (canToggle) nextSequence(direction)
    onClick?.()
  }

  return (
    <Block size={size} onClick={toggleElements}>
      <AnimatePresence initial={false}>
        <MotionConfig reducedMotion={canAnimate ? 'user' : 'never'}>
          {mappedElements[seq]}
        </MotionConfig>
      </AnimatePresence>
    </Block>
  )
}
export default SequenceElementsToggler

// utils

// Inner Components

const Block = styled.div<{ size: Size }>`
  ${Flex.Container.style(true)
    .alignItems('center')
    .justifyContent('flex-start')
    .create()};
  position: relative;
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  ${({ size }) => sizeStyles[size]};
`

const StyledMotionSpan = styled(motion.span)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  //color: ${colors.primary1};
`

// styles

const sizeStyles: Record<Size, ReturnType<typeof css>> = {
  xxs: css`
    font-size: 8px;
    width: 10px;
    height: 10px;
  `,
  xs: css`
    font-size: 10px;
    width: 12px;
    height: 12px;
  `,
  small: css`
    font-size: 12px;
    width: 16px;
    height: 16px;
  `,
  medium: css`
    font-size: 14px;
    width: 20px;
    height: 20px;
  `,
  large: css`
    font-size: 16px;
    width: 24px;
    height: 24px;
  `,
  xl: css`
    font-size: 20px;
    width: 32px;
    height: 32px;
  `,
  xxl: css`
    font-size: 24px;
    width: 40px;
    height: 40px;
  `,
}
