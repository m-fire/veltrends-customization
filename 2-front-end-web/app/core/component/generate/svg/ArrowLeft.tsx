import * as React from 'react'
import { SVGProps } from 'react'

const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M8 16 0 8l8-8 1.4 1.4L3.7 7H16v2H3.7l5.7 5.6L8 16Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgArrowLeft
