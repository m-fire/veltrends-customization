import React from 'react'
import styled from 'styled-components'
import Input, { InputProps } from '~/components/Input'

interface LabelInputProps extends InputProps {
  label: string
}

function LabelInput({}: LabelInputProps) {
  return (
    <>
      <Block>{}</Block>
    </>
  )
}
export default LabelInput

// Inner Components

const Block = styled.div``
