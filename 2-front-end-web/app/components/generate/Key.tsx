import * as React from 'react'
import { SVGProps } from 'react'

const SvgKey = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path d="M10.667 1.333c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4Zm0-1.333a5.334 5.334 0 1 0 0 10.667 5.334 5.334 0 0 0 0-10.667ZM7.063 10.933 6.082 12H4v1.333H2.667v1.334H1.333v-1.453L5.27 9.23a6.702 6.702 0 0 1-.692-1.197L0 12.667V16h4v-1.333h1.333v-1.334h1.334L8.3 11.558a6.585 6.585 0 0 1-1.238-.625ZM12 3.333a.668.668 0 0 1 0 1.334.668.668 0 0 1 0-1.334Zm0-.666a1.334 1.334 0 1 0 .001 2.667A1.334 1.334 0 0 0 12 2.667Z" />
  </svg>
)

export default SvgKey
