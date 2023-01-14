import React, { ReactNode } from 'react'
import VariantLinkButton from '~/core/component/VariantLinkButton'
import { Person } from '~/core/component/generate/svg'
import styled from 'styled-components'
import { decorateStyles } from '~/core/style/decorate-styles'
import { Flex } from '~/common/style/css-builder'

type UserInformationProps = {
  username: string
  children?: ReactNode
}

function UserInformation({ username }: UserInformationProps) {
  return (
    <Responsive>
      <VariantLinkButton variant="textonly">
        <Icon>
          {username}
          <StyledPerson />
        </Icon>
      </VariantLinkButton>
    </Responsive>
  )
}
export default UserInformation

// Inner Components

const Responsive = styled.div`
  ${Flex.container().create()};
  position: relative;
`

const Icon = styled.span`
  ${Flex.container().alignItems('center').create()};
  svg {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`

const StyledPerson = styled(Person)`
  width: 20px;
`
