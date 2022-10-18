import { FormEventHandler } from 'react'
import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import { useWriteContext } from '~/context/WriteContext'
import LabelInput from '~/components/system/LabelInput'

function WriteLink() {
  const navigate = useNavigate()
  const { state, actions } = useWriteContext()

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    actions.setLink(formData.get('url') as string)
    navigate('/write/intro')
  }

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요."
        buttonText="다음"
        onSubmit={onSubmit}
      >
        <LabelInput
          label="URL"
          placeholder="https://example.com"
          name="url"
          defaultValue={state.link}
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  )
}

export default WriteLink
