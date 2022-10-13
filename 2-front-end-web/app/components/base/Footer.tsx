import React, { useMemo } from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import FooterTabItem from '~/components/base/FooterTabItem'
import { useLocation } from '@remix-run/react'

const paths = ['search', 'bookmark', 'setting'] as const

function isValidPath(path: any): path is typeof paths[number] {
  return paths.includes(path)
}

type FooterProps = {}

function Footer({}: FooterProps) {
  const location = useLocation()

  const currentPage = useMemo(() => {
    const path = location.pathname.split('/')[1]
    if (isValidPath(path)) {
      return path
    }
    return 'home'
  }, [location.pathname])

  return (
    <StyledFooter>
      <FooterTabItem isActive={currentPage === 'home'} />
      <FooterTabItem isActive={currentPage === 'search'} />

      <FooterTabItem icon="add" />

      <FooterTabItem isActive={currentPage === 'bookmark'} />
      <FooterTabItem isActive={currentPage === 'setting'} />
    </StyledFooter>
  )
}
export default Footer

// Inner Components

const StyledFooter = styled.footer`
  height: 56px;
  border-top: 1px solid ${colors.grey1};
  display: flex;
`
