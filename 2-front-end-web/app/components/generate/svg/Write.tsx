import * as React from 'react'
import { SVGProps } from 'react'

const SvgWrite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="m5.616 8.205 2.935 3.2-3.884.959.949-4.159ZM16 3.297l-6.46 7.13L6.518 7.13 12.976 0 16 3.297Zm-4 6.485v4.764H1.333V5.818H5.83l1.318-1.454H0V16h13.333V8.31L12 9.783Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgWrite
