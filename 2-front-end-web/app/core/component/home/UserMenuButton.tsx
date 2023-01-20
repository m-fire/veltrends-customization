import React, { ReactNode, useState } from 'react'
import VariantLinkOrButton from '~/core/component/VariantLinkOrButton'
import { Person } from '~/core/component/generate/svg'
import styled from 'styled-components'
import { Flex } from '~/common/style/css-builder'
import ContextMenu from '~/common/component/template/ContextMenu'
import { Media } from '~/common/style/media-query'
import { useLogout } from '~/core/hook/auth/useLogout'

type UserInformationProps = {
  username: string
  children?: ReactNode
}

function UserMenuButton({ username }: UserInformationProps) {
  const [visible, setVisible] = useState(false)

  const logout = useLogout()
  const onToggleMenu = () => setVisible(!visible)

  return (
    <Responsive>
      <VariantButton
        variant="textonly"
        size="small"
        onClick={() => onToggleMenu()}
        disabled={visible}
      >
        <AuthUserInfo>
          <StyledPerson />
          {username}
        </AuthUserInfo>
      </VariantButton>

      <StyledContextMenu onClose={onToggleMenu} visible={visible}>
        <WriteInnerButton to="/write" variant="textonly" size="medium">
          새 글 작성
        </WriteInnerButton>
        <VariantButton to="/setting/account" variant="textonly" size="medium">
          내 계정
        </VariantButton>
        <VariantButton to="/bookmarks" variant="textonly" size="medium">
          북마크
        </VariantButton>
        <VariantButton variant="textonly" size="medium" onClick={logout}>
          로그아웃
        </VariantButton>
      </StyledContextMenu>
    </Responsive>
  )
}
export default UserMenuButton

// Inner Components

const Responsive = styled.div`
  ${Flex.container().create()};
  position: relative;
`

const AuthUserInfo = styled.span`
  ${Flex.container().alignItems('center').justifyContent('flex-end').create()};
  svg {
    margin-right: 6px;
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

const VariantButton = styled(VariantLinkOrButton)`
  padding: 0;
`

const WriteInnerButton = styled(VariantButton)`
  ${Media.minWidth.desktop} {
    display: none;
  }
`
