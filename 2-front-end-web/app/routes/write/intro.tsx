import BasicLayout from '~/components/layout/BasicLayout'
import { useWriteContext } from '~/context/WriteContext'
import { useNavigate } from '@remix-run/react'

type IntroProps = {}
function Intro({}: IntroProps) {
  const navigate = useNavigate()
  const { state, actions } = useWriteContext()

  return <BasicLayout title="뉴스 소개" hasBackButton></BasicLayout>
}

export default Intro

// Inner Components
