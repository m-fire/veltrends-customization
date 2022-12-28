import React, { ReactNode, useCallback, useMemo, useReducer } from 'react'
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
  // 시퀀스 타입. default: increase
  seqType?: SequenceType
  // 시퀀싱이 시작될 요소의 최초 index
  startIndex?: number
  // 다음 시퀀스 스탭. default: 1
  seqStep?: number
  size?: Size
  canAnimate?: boolean
  disabled?: boolean
  onClick?: () => void
}
type Size = 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'
type SequenceType = 'forward' | 'backward' | 'random'

function SequenceElementsToggler({
  elements,
  seqType = 'forward',
  startIndex = 0,
  seqStep = 1,
  size = 'medium',
  canAnimate = true,
  disabled = false,
  onClick,
}: SequenceElementsTogglerProps) {
  //
  const initialSeqState = {
    seq:
      startIndex == null
        ? seqType === 'backward'
          ? elements.length - 1
          : seqType === 'random'
          ? rn.randomInt({ bound: elements.length })
          : 0 // `increase` init value or No`startSequence`prop,
        : startIndex,
    bound: elements.length,
    step: seqStep,
  }
  validateState(initialSeqState)

  type SequenceReducerState = Pick<typeof initialSeqState, 'seq' | 'bound'>
  const sequenceReducer = useCallback(
    (state: SequenceReducerState, { type }: { type: SequenceType }) => {
      switch (type) {
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
    [],
  )
  const [sequenceState, nextSequence] = useReducer(
    sequenceReducer,
    initialSeqState,
  )

  /* Optional rendering */

  // 입력된 element 가 1개일 경우 랜더링
  if (elements.length === 1) {
    const singleChild = createMotionChild(sequenceState.seq, elements[0])
    return renderOptional({
      child: singleChild,
      size,
      canAnimate,
      onClick,
    })
  }

  // 입력된 element 가 2~N개일 경우 랜더링
  const toggleElement = () => {
    onClick?.()
    if (!disabled) nextSequence({ type: seqType })
  }
  const wrappedElements = useMemo(
    () => elements.map((child) => createMotionChild(sequenceState.seq, child)),
    [elements, sequenceState.seq],
  )
  return renderOptional({
    child: wrappedElements[sequenceState.seq],
    size,
    canAnimate,
    onClick: toggleElement,
  })
  // end render
}
export default SequenceElementsToggler

// utils

function renderOptional({
  size,
  child,
  canAnimate,
  onClick,
}: RenderOptionalParams) {
  return (
    <Block size={size} onClick={onClick}>
      <AnimatePresence initial={false}>
        <MotionConfig reducedMotion={canAnimate ? 'user' : 'never'}>
          {child}
        </MotionConfig>
      </AnimatePresence>
    </Block>
  )
}
type RenderOptionalParams = {
  child: ReactNode
} & Pick<Required<SequenceElementsTogglerProps>, 'size' | 'canAnimate'> &
  Pick<SequenceElementsTogglerProps, 'onClick'>

function createMotionChild(motionKey: any, child: ReactNode) {
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

function validateState({ seq, bound }: { seq: number; bound: number }) {
  if (seq < 0 || seq >= bound)
    throw new Error(
      `sequence(${seq}) number must equal and greater than 0 or less than children length(${bound})`,
    )
  if (bound < 1) throw new Error(`bound(${bound}) must 1 or more`)
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
