import React from 'react'
import styled from 'styled-components'
import Header from '~/components/Header'

type RegisterProps = {}

function Register({}: RegisterProps) {
  return (
    <Page>
      <Header title="회원가입" />
    </Page>
  )
}

Register.defaultProps = {
  // initial prop values
} as RegisterProps

export default Register

// Sub Comps

const Page = styled.div`
  height: 100%;
`
