/* font relative length. 글꼴 상대 길이. */
const fontUnit = {
  // - Experimental.
  // 요소 font의 "cap height"(영문 대문자의 평균 높이 값)를 나타냅니다.
  cap: 'cap',
  // 요소 font의 문자 "0"(영, 유니코드 U+0030)의 너비를 나타냅니다. 문자 "0"의 너비를 측정하는 것이 불가능하거나 실용적이지 않은 경우 너비 0.5em에 높이 1em이라고 가정해야 합니다.
  ch: 'ch',
  // 요소 font-size의 계산값. 요소의 font-size 속성에 사용한다면 상속받는 font-size 값을 나타냅니다.
  em: 'em',
  // 요소 font의 x높이를 나타냅니다. "x"문자를 가진 글꼴에서는 보통 소문자 높이와 같습니다. 많은 글꼴에서 1ex ≈ 0.5em입니다.
  ex: 'ex',
  // - Experimental.
  // "水" (한중일 한자 "물", U+6C34) 문자를 렌더링할 때 사용하는 글꼴에서의 너비를 나타냅니다.
  ic: 'ic',
  // - Experimental.
  // 요소가 line-height (en-US)를 가지고 있는 경우, line-height의 계산값을 절대 길이로 변환해 나타냅니다.
  lh: 'lh',
  // 루트 요소(보통 <html>)의 font-size를 나타냅니다. 루트 요소의 font-size에 사용할 경우 최초값(보통 브라우저 기본값은 16px이나 사용자 설정으로 변할 수 있음)을 나타냅니다.
  rem: 'rem',
  // - Experimental.
  // 루트 요소(보통 <html>)의 line-height (en-US)를 절대 길이로 변환해 나타냅니다. 루트 요소의 font-size나 line-height에 사용할 경우 최초값을 나타냅니다.
  rlh: 'rlh',
} as const
type FontUnit = keyof typeof fontUnit

/* viewport percentage length. 뷰포트 백분율 길이 */
const viewportUnit = {
  // 뷰포트의 초기 컨테이닝 블록 높이 1%와 같습니다.
  vh: 'vh',
  // 뷰포트의 초기 컨테이닝 블록 너비 1%와 같습니다.
  vw: 'vw',
  // - Experimental.
  // 초기 컨테이닝 블록의 인라인 축 크기 1%와 같습니다.
  vi: 'vi',
  // - Experimental.
  // 초기 컨테이닝 블록의 블록 축 크기 1%와 같습니다.
  vb: 'vb',
  // vw와 vh 중 작은 것과 같습니다.
  vmin: 'vmin',
  // vw와 vh 중 큰 것과 같습니다.
  vmax: 'vmax',
} as const
type ViewportUnit = keyof typeof viewportUnit

/* absolute unit of length. 절대 길이 단위 */
const absoluteUnit = {
  // 1 픽셀. 화면에서는 전통적으로 하나의 장치 픽셀(점)을 의미했지만, 프린터나 고해상도 화면에서는 1/96 in을 맞출 수 있도록 여러 개의 장치 픽셀을 의미합니다.
  px: 'px',
  // 1 센티미터, 1cm = 96px/2.54.
  cm: 'cm',
  // 1 밀리미터, 1mm = 1/10 cm.
  mm: 'mm',
  // - Experimental.
  // 1/4 밀리미터, 1Q = 1/40 cm.
  Q: 'Q',
  // 1 인치, 1in = 2.54cm = 96px.
  in: 'in',
  // 1 피카, 1pc = 12pt = 1/61in.
  pc: 'pc',
  // One point. 1pt = 1/72nd of 1in.
  pt: 'pt',

  // One point. 1pt = 1/72nd of 1in.
  '%': '%',
} as const
type AbsoluteUnit = keyof typeof absoluteUnit

/* angle. 각도 단위 */
const angleUnit = {
  // 각도` 를 N도 단위로 나타냅니다. 1회전은 360deg입니다. 예: 0deg, 90deg, 14.23deg
  deg: 'deg',
  // 각도를 그레이드로 나타냅니다. 1회전은 400grad입니다. 예: 0grad, 100grad, 38.8grad
  grad: 'grad',
  // 각도를 라디안으로 나타냅니다. 1회전은 2π 라디안으로 약 6.2832rad입니다. 1rad는 180/πdeg입니다. 예: 0rad, 1.0708rad, 6.2832rad
  rad: 'rad',
  // 각도를 회전의 수로 나타냅니다. 1회전은 1turn입니다. 예: 0turn, 0.25turn, 1.2turn
  turn: 'turn',
} as const
export type AngleUnit = keyof typeof angleUnit

export type LengthUnit = FontUnit | AngleUnit | ViewportUnit | AbsoluteUnit

/* All of unit */
export const unit = {
  ...fontUnit,
  ...viewportUnit,
  ...angleUnit,
  ...absoluteUnit,
} as const
export type Unit = keyof typeof unit
