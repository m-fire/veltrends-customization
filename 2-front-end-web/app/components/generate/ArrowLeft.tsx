import * as React from 'react'
import { SVGProps } from 'react'

const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M10 19.375.625 10 10 .625l1.64 1.64-6.68 6.563h14.415v2.344H4.961l6.68 6.562L10 19.375Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgArrowLeft
