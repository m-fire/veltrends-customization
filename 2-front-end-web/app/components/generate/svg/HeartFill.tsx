import * as React from 'react'
import { SVGProps } from 'react'

const SvgHeartFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M14.943 1.913a5.946 5.946 0 0 0-.312-.385 4.362 4.362 0 0 0-6.632 0 4.362 4.362 0 0 0-6.631 0c-1.824 2.04-1.824 5.37 0 7.416L7.1 15.352l.348.391a.723.723 0 0 0 1.103 0l6.08-6.8c1.714-1.915 1.817-4.975.312-7.03Z"
      fill="#fff"
    />
    <path
      d="M14.943 1.913a5.946 5.946 0 0 0-.312-.385 4.362 4.362 0 0 0-6.632 0 4.362 4.362 0 0 0-6.631 0c-1.824 2.04-1.824 5.37 0 7.416L7.1 15.352l.348.391a.723.723 0 0 0 1.103 0l6.08-6.8c1.714-1.915 1.817-4.975.312-7.03ZM4.282 3.343A6.084 6.084 0 0 0 2.55 7.997a3.93 3.93 0 0 1 .292-5.672c.547.272 1.091.55 1.632.835-.064.06-.13.118-.193.183Zm.726-.623a73.723 73.723 0 0 0-1.572-.807 3.823 3.823 0 0 1 3.509-.125 5.923 5.923 0 0 0-1.937.932Z"
      fill="url(#heart-fill_svg__a)"
    />
    <defs>
      <radialGradient
        id="heart-fill_svg__a"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(6.8121 5.9909 -15.39658 17.50706 15.35 8.004)"
      >
        <stop stopColor="#900" />
        <stop offset={0.12} stopColor="#AB1F04" />
        <stop offset={0.33} stopColor="#C7520B" />
        <stop offset={0.54} stopColor="#DE7A10" />
        <stop offset={0.72} stopColor="#EE9614" />
        <stop offset={0.88} stopColor="#F8A816" />
        <stop offset={1} stopColor="#FBAE17" />
      </radialGradient>
    </defs>
  </svg>
)

export default SvgHeartFill
