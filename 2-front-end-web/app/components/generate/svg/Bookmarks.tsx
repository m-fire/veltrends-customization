import * as React from 'react'
import { SVGProps } from 'react'

const SvgBookmarks = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M10 2.91c.354 0 .693.152.943.425s.39.643.39 1.029V16l-4.666-2.182L2 16V4.364c0-.808.6-1.455 1.333-1.455H10ZM6 0h6.667c.353 0 .692.153.943.426.25.273.39.643.39 1.029V13.09l-1.333-.633V1.455h-8c0-.386.14-.756.39-1.029C5.307.153 5.647 0 6 0Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgBookmarks
