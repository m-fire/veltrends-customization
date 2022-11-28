import * as React from 'react'
import { SVGProps } from 'react'

const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path d="M8.667 5.333H3.333v-.666h5.334v.666Zm0 1.334H3.333V6h5.334v.667ZM6.667 8H3.333v-.667h3.334V8Zm7.448 8L9.19 11.075A5.963 5.963 0 0 1 6 12a6 6 0 1 1 6-6 5.968 5.968 0 0 1-.925 3.19L16 14.115 14.115 16ZM6 10c2.573 0 4-1.427 4-4S8.573 2 6 2 2 3.427 2 6s1.427 4 4 4Z" />
  </svg>
)

export default SvgSearch
