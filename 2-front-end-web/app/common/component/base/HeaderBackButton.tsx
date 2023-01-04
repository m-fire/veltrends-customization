import React from 'react'
import styled from 'styled-components'
import { ArrowLeft } from '~/core/component/generate/svg'
import { flexContainer } from '~/common/style/styled'

type HeaderBackButtonProps = {
  onClick?: () => void
}

function HeaderBackButton({ onClick }: HeaderBackButtonProps) {
  return (
    <IconButton onClick={onClick}>
      <StyledArrowLeft />
    </IconButton>
  )
}
export default HeaderBackButton

const IconButton = styled.button`
  /* Todo: 터치영역 늘리기: 아이콘위치 W/H 중심유지 */
  ${flexContainer({ alignItems: 'center', justifyContent: 'center' })};
  /* 4방패딩 늘리고, 원위치에서 이동한 만큼 minus 마진으로 원복 */
  padding: 8px;
  margin-left: -8px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  width: 20px;
  height: 20px;
`
