import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import Overlay from '~/common/component/atom/Overlay'

type AppOverlayProps = {
  onClick?: MouseEventHandler<HTMLElement>
}

function AppOverlay({ onClick }: AppOverlayProps) {
  return <StyledOverlay onClick={onClick} />
}
export default AppOverlay

// Inner Components

const StyledOverlay = styled(Overlay)`
  //position: fixed;
  //top: 0;
  //left: 0;
  //width: 100vw;
  //height: 100vh;
  //height: -webkit-fill-available; // safari browser 100vh 이슈해결용
  //background-color: rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 0 100px 0 rgba(0, 0, 0, 1);
  z-index: 10;
`
