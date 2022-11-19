import * as React from 'react'
import { SVGProps } from 'react'

const SvgShortcut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#shortcut_svg__a)">
      <path
        d="M14 8.667v6.666H0V2.667h8V4H1.333v10h11.334V8.667H14Zm2-8H8.675l2.69 2.666-4.652 4.714L8.6 9.932l4.651-4.713L16 8V.667Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="shortcut_svg__a">
        <path fill="currentColor" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgShortcut
