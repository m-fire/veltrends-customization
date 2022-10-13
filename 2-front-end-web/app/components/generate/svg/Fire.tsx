import * as React from 'react'
import { SVGProps } from 'react'

const SvgFire = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.75 0C6.157 4.793 2 6.443 2 10.664 2 13.531 4.046 15.979 8 16c3.954.021 6-2.943 6-5.97 0-2.761-1.375-5.365-3.968-6.983.616 1.738-.204 3.325-1 3.872C9.077 4.694 8.281 1.393 5.75 0Zm3.14 8.667c2.504 2.659.967 6-1.044 6-1.223 0-1.853-.844-1.846-1.718.013-1.622 1.825-1.624 2.89-4.282Z"
    />
  </svg>
)

export default SvgFire
