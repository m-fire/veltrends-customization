import React from 'react'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'
import FullHeightPage from '~/components/FullHeightPage'

type LoginProps = {}

function Login({}: LoginProps) {
  const goBack = useGoBack()

  return (
    <FullHeightPage>
      <Header
        title="로그인"
        headerLeft={<HeaderBackButton onClick={goBack} />}
        headerRight="HR"
      />
    </FullHeightPage>
  )
}

export default Login
