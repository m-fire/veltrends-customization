import * as React from 'react'
import { SVGProps } from 'react'

const SvgClock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#clock_svg__a)" fill="currentColor">
      <path d="M8 0a8 8 0 1 0 .001 16.001A8 8 0 0 0 8 0Zm0 14.089c-3.114 0-6.089-2.421-6.089-6.089 0-3.114 2.975-6.089 6.089-6.089 3.114 0 6.089 2.975 6.089 6.089 0 3.114-2.975 6.089-6.089 6.089Z" />
      <path d="M11.57 10.497 8.647 7.896V3.732c0-.08-.074-.147-.164-.147H7.318c-.09 0-.164.066-.164.147V8.54a.14.14 0 0 0 .067.119l3.421 2.928a.18.18 0 0 0 .23-.03l.734-.855a.136.136 0 0 0-.037-.205Z" />
    </g>
    <defs>
      <clipPath id="clock_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgClock
