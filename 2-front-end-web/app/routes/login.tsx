import React from 'react'
import styled from 'styled-components'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'

type LoginProps = {}

function Login({}: LoginProps) {
  const goBack = useGoBack()

  return (
    <Page>
      <Header
        title="로그인"
        headerLeft={<HeaderBackButton onClick={goBack} />}
        headerRight="HR"
      />
    </Page>
  )
}

export default Login

// Sub Comps

const Page = styled.div`
  height: 100%;
`
