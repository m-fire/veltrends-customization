import Header from '~/components/base/Header'
import Footer from '~/components/base/Footer'
import FullHeightPage from '~/components/system/FullHeightPage'
import styled from 'styled-components'

export default function Index() {
  return (
    <FullHeightPage>
      <Header />
      <Content />
      <Footer />
    </FullHeightPage>
  )
}

// Inner Components

const Content = styled.div`
  flex: 1;
`
