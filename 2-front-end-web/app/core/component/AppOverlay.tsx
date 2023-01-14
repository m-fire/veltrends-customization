import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import Overlay, { OverlayProps } from '~/common/component/atom/Overlay'

type AppOverlayProps = OverlayProps

function AppOverlay({ visible, onClick }: AppOverlayProps) {
  return <Overlay onClick={onClick} visible={visible} />
}
export default AppOverlay

// Inner Components
