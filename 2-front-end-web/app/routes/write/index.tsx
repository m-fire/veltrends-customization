import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import { useWriteContext } from '~/context/WriteContext'
import LabelInput from '~/components/system/LabelInput'

function WriteLink() {
  const navigate = useNavigate()
  const {
    state: {
      form: { link },
    },
    actions,
  } = useWriteContext()

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요."
        buttonText="다음"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/write/intro')
        }}
      >
        <LabelInput
          label="URL"
          placeholder="https://example.com"
          name="url"
          value={link}
          onChange={(e) => {
            actions.change('link', e.target.value)
          }}
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  )
}

export default WriteLink
