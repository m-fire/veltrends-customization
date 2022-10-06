import React from 'react'
import styled from 'styled-components'
import { ArrowLeft } from '~/components/generate'

type HeaderBackButtonProps = {}

function HeaderBackButton({}: HeaderBackButtonProps) {
  return (
    <IconButton>
      <ArrowLeft />
    </IconButton>
  )
}
export default HeaderBackButton

const IconButton = styled.button``
