import React from 'react'
import styled from 'styled-components'
import Input, { InputProps } from '~/components/Input'

interface LabelInputProps extends InputProps {
  label: string
}

function LabelInput({ label, ...rest }: LabelInputProps) {
  return (
    <>
      <Block>
        <label>{label}</label>
        <Input {...rest} />
      </Block>
    </>
  )
}
export default LabelInput

// Inner Components

const Block = styled.div``
