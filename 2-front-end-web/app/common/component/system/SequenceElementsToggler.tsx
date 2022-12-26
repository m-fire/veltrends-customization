import React, {
  ReactNode,
  Reducer,
  useCallback,
  useMemo,
  useReducer,
} from 'react'
import styled, { css } from 'styled-components'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { flexStyles } from '~/common/style/styled'
import { colors } from '~/common/style/colors'
import {
  RandomNumbers as rn,
  SequenceNumbers as sn,
} from '~/common/util/numbers'

export type SequenceElementsTogglerProps = {
  elements: ReactNode[]
  // 초기 랜더링 요소 index
  firstSequence?: number
  // 시퀀스 타입. default: increase
  seqType?: SequenceType
  // 다음 시퀀스 스탭. default: 1
  seqStep?: number
  size?: Size
  isAnimate?: boolean
  disabled?: boolean
  onClick?: () => void
}
type Size = 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'
type SequenceType = typeof sn.Type.INCREASE | typeof sn.Type.DECREASE | 'random'

function SequenceElementsToggler({
  elements,
  seqType = 'increase',
  firstSequence = 0,
  seqStep = 1,
  size = 'medium',
  isAnimate = true,
  disabled = false,
  onClick,
}: SequenceElementsTogglerProps) {
  //
  const initialSequenceState = {
    seq:
      firstSequence == null
        ? seqType === 'decrease'
          ? elements.length - 1
          : seqType === 'random'
          ? rn.randomInt({ bound: elements.length })
          : 0 // `increase` init value or No`startSequence`prop,
        : firstSequence,
    origin: 0,
    bound: elements.length,
    step: seqStep,
  }
  validateState(initialSequenceState)

  /* elements 가 1개 뿐이라면 toggle 기능이 불필요하므로 제외하고 랜더링 */

  if (elements.length === 1) {
    return renderOptional(
      createMotionSpan('single-element', elements[0]),
      onClick,
    )
  }

  /* elements 가 2~N개 일 경우 ... */

  const [sequenceState, nextSequence] = useReducer(
    useCallback(sequenceReducer, []),
    initialSequenceState,
  )
  const toggleElement = () => {
    onClick?.()
    if (!disabled) nextSequence({ type: seqType })
  }

  const wrappedElements = useMemo(
    () => elements.map((child) => createMotionSpan(sequenceState.seq, child)),
    [elements, sequenceState.seq],
  )
  return renderOptional(wrappedElements[sequenceState.seq], toggleElement)

  // utils

  function createMotionSpan(motionKey: any, child: ReactNode) {
    return (
      <StyledMotionSpan
        key={motionKey}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        {child}
      </StyledMotionSpan>
    )
  }

  function renderOptional(child: ReactNode, handleClick?: () => void) {
    return (
      <Block size={size} onClick={handleClick}>
        <AnimatePresence initial={false}>
          <MotionConfig reducedMotion={isAnimate ? 'user' : 'never'}>
            {child}
          </MotionConfig>
        </AnimatePresence>
      </Block>
    )
  }
}
export default SequenceElementsToggler

// utils

function validateState({ seq, bound }: { seq: number; bound: number }) {
  if (seq < 0 || seq >= bound)
    throw new Error(
      `sequence(${seq}) number must equal and greater than 0 or less than children length(${bound})`,
    )
  if (bound < 1) throw new Error(`bound(${bound}) must 1 or more`)
}

function sequenceReducer<
  S extends { seq: number; bound: number },
  A extends { type: SequenceType },
>(state: S, { type }: A) {
  switch (type) {
    case 'increase':
      return {
        ...state,
        seq: sn.increaseByStepInRange(state),
      }
    case 'decrease':
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
}

// Inner Components

const Block = styled.div<{ size: Size }>`
  ${flexStyles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  })};
  position: relative;
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  ${({ size }) => buttonStyleBySize(size)};
`

const StyledMotionSpan = styled(motion.span)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  //color: ${colors.primary1};
`

// styles functions

function buttonStyleBySize(size: Size) {
  if (size === 'xxs')
    return css`
      font-size: 8px;
      width: 10px;
      height: 10px;
    `
  if (size === 'xs')
    return css`
      font-size: 10px;
      width: 12px;
      height: 12px;
    `
  if (size === 'small')
    return css`
      font-size: 12px;
      width: 16px;
      height: 16px;
    `
  if (size === 'medium')
    return css`
      font-size: 14px;
      width: 20px;
      height: 20px;
    `
  if (size === 'large')
    return css`
      font-size: 16px;
      width: 24px;
      height: 24px;
    `
  if (size === 'xl')
    return css`
      font-size: 20px;
      width: 32px;
      height: 32px;
    `
  if (size === 'xxl')
    return css`
      font-size: 24px;
      width: 40px;
      height: 40px;
    `
}
