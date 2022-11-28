import * as React from 'react'
import { SVGProps } from 'react'

const SvgHeartOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="1 1 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M12.32 2.95a2.49 2.49 0 0 1 1.86.88l.19.24a3.81 3.81 0 0 1-.19 4.57l-4.79 5.35a.509.509 0 0 1-.78 0L3.82 8.64a3.76 3.76 0 0 1 0-4.81 2.49 2.49 0 0 1 1.86-.88 2.46 2.46 0 0 1 1.86.88l.88 1a.79.79 0 0 0 1.16 0l.88-1a2.46 2.46 0 0 1 1.86-.88Zm0-2A4.43 4.43 0 0 0 9 2.49a4.36 4.36 0 0 0-6.63 0 5.69 5.69 0 0 0 0 7.41l5.73 6.41.35.39a.711.711 0 0 0 1.1 0l6.08-6.8a5.71 5.71 0 0 0 .31-7 3.68 3.68 0 0 0-.31-.38A4.42 4.42 0 0 0 12.32.99V.95Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgHeartOutline
