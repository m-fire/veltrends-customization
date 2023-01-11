import React, { ReactNode } from 'react'
import { Media, screenBreakpointMap } from '~/common/style/media-query'
import styled, { css } from 'styled-components'

type OptionalDisplayProps = {
  // default: 'minWidth'. see media-query options
  widthLimitType?: WidthLimitType
  // values ref: {@link screenBreakpointMap}
  shows: [DeviceWidthType]
  // If `hides` are included, they take precedence over `shows` and are also excluded from `shows`.
  hides?: [DeviceWidthType]
}
type DeviceWidthType = keyof typeof screenBreakpointMap
type WidthLimitType = keyof typeof Media

type GeneralProps = {
  children: ReactNode
}

function OptionalDisplayBlock({
  widthLimitType = 'minWidth',
  shows,
  hides,
  children,
}: OptionalDisplayProps & GeneralProps) {
  return (
    <StyledBlock widthLimitType={widthLimitType} shows={shows} hides={hides}>
      {children}
    </StyledBlock>
  )
}
export default OptionalDisplayBlock

// Inner Components

const StyledBlock = styled.div<OptionalDisplayProps>`
  ${({ widthLimitType, shows, hides }) =>
    widthLimitType &&
    shows
      .filter((device) => !hides?.includes(device))
      .map(
        (device) =>
          css`
            ${Media[widthLimitType][device]} {
              display: none;
            }
          `,
      )}
`
