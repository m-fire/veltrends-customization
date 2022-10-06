import React from 'react'
import Header from '~/components/Header'
import HeaderBackButton from '~/components/HeaderBackButton'
import { useGoBack } from '~/routes/useGoBack'
import FullHeightPage from '~/components/FullHeightPage'

type RegisterProps = {}

function Register({}: RegisterProps) {
  const goBack = useGoBack()

  return (
    <FullHeightPage>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
        headerRight="HR"
      />
    </FullHeightPage>
  )
}

export default Register

// Sub Comps
