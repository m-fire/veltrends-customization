import React from 'react'
import Overlay, { OverlayProps } from '~/common/component/atom/Overlay'

type AppOverlayProps = OverlayProps

function AppOverlay({ visible, onClick }: AppOverlayProps) {
  return <Overlay onClick={onClick} visible={visible} />
}
export default AppOverlay

// Inner Components
