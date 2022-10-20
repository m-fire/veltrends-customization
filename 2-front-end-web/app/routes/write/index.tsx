import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import { useWriteContext } from '~/context/WriteContext'
import LabelInput from '~/components/system/LabelInput'

function WriteLink() {
  const navigate = useNavigate()
  const { state, actions } = useWriteContext()
  const [link, setLink] = useState(state.link)

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    actions.setLink(link)
    navigate('/write/intro')
  }

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLink(e.target.value)
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
          value={link}
          defaultValue={state.link}
          onChange={onChange}
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  )
}

export default WriteLink
