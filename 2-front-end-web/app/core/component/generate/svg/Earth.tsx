import * as React from 'react'
import { SVGProps } from 'react'

const SvgEarth = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M12.72 12.312A1.605 1.605 0 0 0 11.2 11.2h-.8V8.8a.8.8 0 0 0-.8-.8H4.8V6.4h1.6a.8.8 0 0 0 .8-.8V4h1.6a1.6 1.6 0 0 0 1.6-1.6v-.328a6.387 6.387 0 0 1 2.32 10.24ZM7.2 14.344A6.39 6.39 0 0 1 1.6 8c0-.496.064-.976.168-1.432L5.6 10.4v.8a1.6 1.6 0 0 0 1.6 1.6M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgEarth
