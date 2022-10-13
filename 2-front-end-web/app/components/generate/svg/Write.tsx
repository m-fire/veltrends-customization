import * as React from 'react'
import { SVGProps } from 'react'

const SvgWrite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path d="m5.616 8.521 2.935 2.933-3.884.88.949-3.813ZM16 4.023l-6.46 6.536-3.023-3.024L12.976 1 16 4.023Zm-4 5.944v4.366H1.333v-8H5.83L7.147 5H0v10.667h13.333V8.618L12 9.967Z" />
  </svg>
)

export default SvgWrite
