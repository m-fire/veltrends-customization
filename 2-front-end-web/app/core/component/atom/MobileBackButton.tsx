import React from 'react'
import styled from 'styled-components'
import { ArrowLeft } from '~/core/component/generate/svg'
import IconButton from '~/common/component/atom/IconButton'
import { globalColors } from '~/common/style/global-colors'

type HeaderBackButtonProps = {
  onClick?: () => void
  className?: string
}

function MobileBackButton({ onClick }: HeaderBackButtonProps) {
  return <StyledIconButton onClick={onClick} icon={<StyledArrowLeft />} />
}
export default MobileBackButton

const StyledIconButton = styled(IconButton)`
  color: ${globalColors.grey5};
  // 터치영역 늘리기: 아이콘위치 W/H 중심유지.
  // 4방향 패딩을 늘리고 초기위치에서 padding-left 이동값 만큼 음수마진값으로 원위치 설정
  padding: 8px;
  margin-left: -8px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  width: 20px;
  height: 20px;
`
