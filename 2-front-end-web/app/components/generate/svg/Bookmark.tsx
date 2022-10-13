import * as React from 'react'
import { SVGProps } from 'react'

const SvgBookmark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path d="M10 3.333a1.333 1.333 0 0 1 1.333 1.334v10.666l-4.666-2-4.667 2V4.667c0-.74.6-1.334 1.333-1.334H10ZM6 .667h6.667A1.333 1.333 0 0 1 14 2v10.667l-1.333-.58V2h-8A1.333 1.333 0 0 1 6 .667Z" />
  </svg>
)

export default SvgBookmark
