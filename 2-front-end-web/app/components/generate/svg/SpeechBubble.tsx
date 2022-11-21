import * as React from 'react'
import { SVGProps } from 'react'

const SvgSpeechBubble = (props: SVGProps<SVGSVGElement>) => (
  <svg
    preserveAspectRatio="none"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    {...props}
  >
    <path
      d="M8.001 0C3.777 0 .005 3.074.005 7.278a6.772 6.772 0 0 0 1.37 4.091C1.412 12.7.69 14.61.048 16c1.732-.34 4.197-1.097 5.314-1.845.882.24 1.792.362 2.705.366 4.72 0 7.938-3.518 7.938-7.243C15.998 3.05 12.194 0 8 0Zm.055 12.672a9.695 9.695 0 0 1-2.712-.434c-.62.413-.985.7-2.639 1.227.329-.92.456-1.9.373-2.873-.52-.686-1.25-1.618-1.25-3.285 0-2.971 2.769-5.394 6.169-5.394 3.4 0 6.168 2.42 6.168 5.394.005 3.315-3.17 5.365-6.114 5.365h.005Z"
      fill="currentColor"
    />
    <path
      d="M8.001 8.866H4.574v.915h3.427v-.915ZM11.2 7.038H4.574v.914H11.2v-.914ZM11.2 5.21H4.574v.913H11.2V5.21Z"
      fill="currentColor"
    />
  </svg>
)

export default SvgSpeechBubble
