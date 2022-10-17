import { FormEventHandler } from 'react'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'

function Intro() {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const body = formData.get('body') as string
    console.log(title, body)
  }

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요."
        buttonText="등록하기"
        onSubmit={onSubmit}
      >
        뉴스 소개 페이지 컨탠츠영역
      </WriteFormTemplate>
    </BasicLayout>
  )
}
export default Intro

// Inner Components
