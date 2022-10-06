import React from 'react'
import styled from 'styled-components'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'

type RegisterProps = {}

function Register({}: RegisterProps) {
  const goBack = () => console.log(`Register.goBack()`)

  return (
    <Page>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
        headerRight="HR"
      />
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
