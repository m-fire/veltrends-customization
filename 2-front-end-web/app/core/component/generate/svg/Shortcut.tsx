import * as React from 'react'
import { SVGProps } from 'react'

const SvgShortcut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#shortcut_svg__a)">
      <path
        d="M14 8.727V16H0V2.182h8v1.454H1.333v10.91h11.334V8.727H14ZM16 0H8.675l2.69 2.91-4.652 5.14L8.6 10.109l4.651-5.142L16 8V0Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="shortcut_svg__a">
        <path d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgShortcut
