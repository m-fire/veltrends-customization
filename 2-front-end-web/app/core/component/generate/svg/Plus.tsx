import * as React from 'react'
import { SVGProps } from 'react'

const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path d="M16 6.667H9.333V0H6.667v6.667H0v2.666h6.667V16h2.666V9.333H16V6.667Z" />
  </svg>
)

export default SvgPlus
