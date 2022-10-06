import React from 'react'
import styled from 'styled-components'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'

type RegisterProps = {}

function Register({}: RegisterProps) {
  const goBack = useGoBack()

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

export default Register

// Sub Comps

const Page = styled.div`
  height: 100%;
`
