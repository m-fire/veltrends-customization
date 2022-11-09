import React, { MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'
import { HeartFill, HeartOutline } from '~/components/generate/svg'
import { colors } from '~/common/style/colors'

type LikeButtonProps = {
  onClick: MouseEventHandler
  isLiked: boolean
}

function LikeButton({ onClick, isLiked }: LikeButtonProps) {
  return (
    <StyledButton onClick={onClick}>
      {isLiked ? <StyledHeartFill /> : <StyledHeartOutline />}
    </StyledButton>
  )
}
export default LikeButton

const StyledButton = styled.div`
  padding: 0;
  border: none;
  outline: none;
  background: none;
`

/* Wrap styled from SVG Components */

const StyledHeartFill = styled(HeartFill)`
  width: 18px;
  height: 18px;
  //color: ${colors.primary1};
`

const StyledHeartOutline = styled(HeartOutline)`
  width: 18px;
  height: 18px;
  color: ${colors.grey2};
`

// Inner Components
