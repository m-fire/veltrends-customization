import React from 'react'
import styled from 'styled-components'

// Common Block
const Block = styled.header``

type HeaderProps = {}

function Header({}: HeaderProps) {
  return <Block>Block</Block>
}

Header.defaultProps = {
  // initial prop values
} as HeaderProps

export default Header
