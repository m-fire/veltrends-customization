import * as React from 'react'
import { SVGProps } from 'react'

const SvgHeartActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M14.943 1.913a5.8 5.8 0 0 0-.311-.384A4.36 4.36 0 0 0 8 1.53a4.362 4.362 0 0 0-6.632 0c-1.823 2.04-1.823 5.37 0 7.418L7.1 15.356l.348.388a.725.725 0 0 0 1.104 0l6.08-6.797c1.714-1.918 1.817-4.978.311-7.033Z"
      fill="#fff"
    />
    <path
      d="M14.943 1.913a5.8 5.8 0 0 0-.311-.384A4.36 4.36 0 0 0 8 1.53a4.362 4.362 0 0 0-6.632 0c-1.823 2.04-1.823 5.37 0 7.418L7.1 15.356l.348.388a.725.725 0 0 0 1.104 0l6.08-6.797c1.714-1.918 1.817-4.978.311-7.033Zm-10.66 1.43A6.084 6.084 0 0 0 2.55 7.999 3.932 3.932 0 0 1 2.6 2.553c.08-.078.161-.15.244-.214.548.27 1.094.55 1.633.833-.065.05-.131.11-.194.172Zm.725-.622a77.126 77.126 0 0 0-1.57-.808 3.823 3.823 0 0 1 3.51-.124 5.966 5.966 0 0 0-1.94.932Z"
      fill="url(#heart-active_svg__a)"
    />
    <defs>
      <radialGradient
        id="heart-active_svg__a"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(10.12264 -7.03646 4.3582 6.2697 13.658 8.091)"
      >
        <stop stopColor="#B14300" />
        <stop offset={0.1} stopColor="#B94E02" />
        <stop offset={0.71} stopColor="#E89311" />
        <stop offset={1} stopColor="#FBAE17" />
      </radialGradient>
    </defs>
  </svg>
)

export default SvgHeartActive
