const { random: math_random, sign: math_sign, abs: math_abs } = Math

/* Numbers */

export class Numbers {
  static stringToHashCode(s: string) {
    let hash = 0
    let i = 0
    for (; i < s.length; i++) {
      var code = s.charCodeAt(i)
      hash = (hash << 5) - hash + code
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }
}

const N = Numbers

/* Random Numbers */

// messages
export class RandomNumbers {
  static randomInt({
    origin = 0,
    bound: bnd,
    innerBound = true,
  }: RandomIntParams) {
    const bound = innerBound ? bnd - 1 : bnd
    if (bound < origin) {
      throw new Error(
        innerBound
          ? `range must a innerBound(${bound}) greater than origin(${origin}).`
          : `range must a bound(${bound}) greater than origin(${origin}).`,
      )
    }
    if (bound - origin < 1) return origin

    return Math.round(
      origin == 0
        ? math_random() * bound
        : math_random() * (bound - origin) + origin,
    )
  }
}

type RandomIntParams = {
  origin?: number
  bound: number
  innerBound?: boolean
}

// SequenceNumbers

export class SequenceNumbers {
  static Type = {
    INCREASE: 'increase',
    DECREASE: 'decrease',
  } as const

  static increaseByStepInRange(params: SequencingParams) {
    return SequenceNumbers.sequencing('increase', params)
  }

  static decreaseByStepInRange(params: SequencingParams) {
    return SequenceNumbers.sequencing('decrease', params)
  }
  private static sequencing(
    type: SequenceType,
    {
      seq,
      origin = 0,
      step = 1,
      repeat = true,
      bound: bnd,
      innerBound = true,
    }: SequencingParams,
  ) {
    const bound = innerBound ? bnd - math_sign(bnd) : bnd
    validateSequencingParams(type, step, seq, origin, bound, innerBound)

    const next =
      seq !== bound ? (nextSequence(type, seq, step) as number) : origin

    if (isOutOfBound(type, next, bound)) {
      return repeat ? origin + next - bound : bound
    }

    return next
  }
}
const SN = SequenceNumbers

// types

type SequencingParams = {
  //증가/감소 시킬 시퀀스
  seq: number
  //경계 시작값
  origin?: number
  //경계값
  bound: number
  //증가/감소 단계값
  step?: number
  //시퀀스가 경계에 다달았을때 origin 부터 다시 시퀀싱 할  할 것인지를 결정.
  //false 인 경우, 경계값이 반복적으로 불려진다.
  repeat?: boolean
  //경계값의 안쪽을 경계값으로 할 것인지를 결정.
  //ex) true: seq`<`bound | false: seq`<=`bound
  //즉 for i 반복문에서 특정배열의 length 를 경계로 두는 것이 하나의 예시이다.
  innerBound?: boolean
}

type SequenceType = typeof SN.Type.INCREASE | typeof SN.Type.DECREASE

// utils

function nextSequence(type: SequenceType, seq: number, step: number) {
  switch (type) {
    case 'increase':
      return seq + step
    case 'decrease':
      return seq - step
    default:
      throwErrorForUnhandledType(type)
  }
}

function validateSequencingParams(
  type: SequenceType,
  step: number,
  seq: number,
  origin: number,
  bound: number,
  innerBound: boolean,
) {
  if (step < 1 || step > math_abs(bound)) {
    throw new Error(
      `step(${step}) must between 1 and ${boundErrorString(
        innerBound,
        bound,
      )}.`,
    )
  }
  switch (type) {
    case 'increase': {
      if (bound <= origin)
        throw new Error(
          `increasing sequences range must a ${boundErrorString(
            innerBound,
            bound,
          )} greater than origin(${origin}).`,
        )
      if (seq < origin || seq > bound)
        throw new Error(`sequence out of bounds. seq(${seq})`)
      break
    }
    case 'decrease': {
      if (bound >= origin)
        throw new Error(
          `decreasing sequences range must a ${boundErrorString(
            innerBound,
            bound,
          )} less than origin(${origin}).`,
        )
      if (seq > origin || seq < bound)
        throw new Error(`Sequence out of bounds. seq(${seq})`)
      break
    }
    default:
      throw new Error(`Unhandled type: ${type}`)
  }
}

function boundErrorString(innerBound: boolean, bound: number) {
  return innerBound ? `innerBound(${bound})` : `bound(${bound})`
}

function isOutOfBound(type: SequenceType, n: number, bound: number) {
  switch (type) {
    case 'increase':
      return n > bound
    case 'decrease':
      return n < bound
    default:
      throwErrorForUnhandledType(type)
  }
}

function throwErrorForUnhandledType(type: string) {
  throw new Error(`Unhandled type: ${type}`)
}
