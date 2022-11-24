import * as React from 'react'
import { SVGProps } from 'react'

const SvgLoading = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#loading_svg__a)" fill="currentColor">
      <path d="M7.995 4.146a.887.887 0 0 1-.886-.887V.89a.89.89 0 1 1 1.776 0v2.37a.89.89 0 0 1-.89.887ZM15.113 8.89h-2.37a.89.89 0 1 1 0-1.78h2.37a.89.89 0 1 1 0 1.78ZM13.024 13.915a.89.89 0 0 1-.629-.26l-1.675-1.676a.89.89 0 0 1 1.257-1.257l1.676 1.678a.89.89 0 0 1-.629 1.515ZM7.995 16a.889.889 0 0 1-.886-.89v-2.37a.889.889 0 1 1 1.776 0v2.37a.889.889 0 0 1-.89.89ZM2.967 13.915a.889.889 0 0 1-.629-1.515l1.676-1.678A.89.89 0 0 1 5.27 11.98l-1.676 1.676a.889.889 0 0 1-.628.26ZM3.26 8.89H.89a.89.89 0 0 1 0-1.78h2.37a.89.89 0 0 1 0 1.78ZM4.65 5.536a.884.884 0 0 1-.63-.26L2.346 3.6a.89.89 0 0 1 1.257-1.257l1.676 1.675a.89.89 0 0 1-.629 1.518Z" />
    </g>
    <defs>
      <clipPath id="loading_svg__a">
        <path d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgLoading
