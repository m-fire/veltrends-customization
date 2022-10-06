import React from 'react'
import styled from 'styled-components'

type AuthFormProps = {
  mode: 'login' | 'register'
}

function AuthForm({ mode }: AuthFormProps) {
  return (
    <>
      <Block>AuthForm - mode: "{mode}"</Block>
    </>
  )
}
export default AuthForm

// Inner Components

const Block = styled.div``
