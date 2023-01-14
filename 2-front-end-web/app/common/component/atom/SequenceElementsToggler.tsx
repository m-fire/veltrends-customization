import React, { ReactNode, useMemo, useReducer } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { appColors } from '~/core/style/app-colors'
import {
  Numbers as n,
  RandomNumbers as rn,
  SequenceNumbers as sn,
} from '~/common/util/numbers'
import { Flex } from '~/common/style/css-builder'
import { Size, imageSizeStyles } from '~/common/style/styles'

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
  ${Flex.container(true)
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
  ${({ size }) => imageSizeStyles[size]};
`

const StyledMotionSpan = styled(motion.span)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  //color: ${appColors.primary1};
`

// styles
