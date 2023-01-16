import React, { ReactNode, useState } from 'react'
import VariantLinkOrButton from '~/core/component/VariantLinkOrButton'
import { Person } from '~/core/component/generate/svg'
import styled from 'styled-components'
import { Flex } from '~/common/style/css-builder'
import ContextMenu from '~/common/component/template/ContextMenu'

type UserInformationProps = {
  username: string
  children?: ReactNode
}

function UserInformation({ username }: UserInformationProps) {
  const [visible, setVisible] = useState(false)

  const onToggleMenu = () => setVisible(!visible)

  return (
    <Responsive>
      <VariantLinkOrButton
        variant="textonly"
        size="small"
        onClick={() => onToggleMenu()}
        disabled={visible}
      >
        <AuthUser>
          <StyledPerson />
          {username}
        </AuthUser>
      </VariantLinkOrButton>

      <StyledContextMenu onClose={onToggleMenu} visible={visible}>
        <VariantLinkOrButton to="/write" variant="textonly" size="medium">
          새글등록
        </VariantLinkOrButton>
        <VariantLinkOrButton to="/account" variant="textonly" size="medium">
          내 계정
        </VariantLinkOrButton>
        <VariantLinkOrButton to="/bookmarks" variant="textonly" size="medium">
          북마크
        </VariantLinkOrButton>
        <VariantLinkOrButton to="/" variant="textonly" size="medium">
          로그아웃
        </VariantLinkOrButton>
      </StyledContextMenu>
    </Responsive>
  )
}
export default UserInformation

// Inner Components

const Responsive = styled.div`
  ${Flex.container().create()};
  position: relative;
`

const AuthUser = styled.span`
  ${Flex.container().alignItems('center').justifyContent('flex-end').create()};
  svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`

const StyledPerson = styled(Person)`
  width: 20px;
`

const StyledContextMenu = styled(ContextMenu)`
  width: 130px;
`
