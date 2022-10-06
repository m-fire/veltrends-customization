import React from 'react'
import styled from 'styled-components'
import { ArrowLeft } from '~/components/generate'

type HeaderBackButtonProps = {
  onClick?: () => void
}

function HeaderBackButton({ onClick }: HeaderBackButtonProps) {
  return (
    <IconButton onClick={onClick}>
      <ArrowLeft />
    </IconButton>
  )
}
export default HeaderBackButton

const IconButton = styled.button`
  /* 버튼 기본CSS 초기화 */
  padding: 0;
  border: none;
  background: none;
  /* Todo: 터치영역 늘리기: 아이콘위치 W/H 중심유지 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 4방패딩 늘리고, 원위치에서 이동한 만큼 minus 마진으로 원복 */
  padding: 8px;
  margin-left: -8px;
`
