import * as React from 'react'
import { SVGProps } from 'react'

const SvgSpeechBubble = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <g clipPath="url(#speech_bubble_svg__a)">
      <path
        d="M8 1.455c3.675 0 6.666 2.612 6.666 5.823 0 3.576-3.43 5.79-6.606 5.79-1.292 0-2.256-.29-2.93-.469-.666.446-1.063.755-2.847 1.324.356-.999.482-1.999.4-3.102-.558-.727-1.35-1.745-1.35-3.543 0-3.211 2.99-5.823 6.667-5.823ZM8 0C3.775 0 0 3.073 0 7.278c0 1.49.492 2.955 1.365 4.09C1.4 12.7.683 14.61.036 16c1.735-.342 4.2-1.097 5.318-1.844.946.25 1.85.365 2.706.365 4.723 0 7.94-3.517 7.94-7.244C16 3.051 12.199 0 8 0Zm0 10.182H4.666v-.727H8v.727ZM11.333 8H4.666v-.727h6.667V8Zm0-2.182H4.666v-.727h6.667v.727Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="speech_bubble_svg__a">
        <path d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default SvgSpeechBubble
