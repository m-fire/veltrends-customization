import { ChangeEventHandler, useEffect, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ActionFunction, json, redirect } from '@remix-run/node'
import styled from 'styled-components'
import LabelInput from '~/common/component/system/LabelInput'
import BasicLayout from '~/common/component/layout/BasicLayout'
import WriteFormTemplate from '~/core/component/write/WriteFormTemplate'
import LabelTextArea from '~/common/component/system/LabelTextArea'
import { Authenticator } from '~/core/api/auth'
import { createItem } from '~/core/api/items'
import { useWriteContext } from '~/core/context/WriteContext'
import AppError, { APP_ERRORS_INFO } from '~/common/error/AppError'
import { useAppErrorCatch } from '~/common/hook/useAppErrorCatch'
import { colors } from '~/common/style/colors'
import { flexContainer, fontStyles } from '~/common/style/styled'

type IntroProps = {}

function Intro({}: IntroProps) {
  const {
    state: { form },
    action: { change: changeFormData },
  } = useWriteContext()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /* Remix submitting hooks */
  const initialForm = { title: '', body: '' }
  const fetcher = useFetcher<typeof initialForm>()

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    e,
  ) => {
    const formKey = e.target.name as keyof Omit<typeof form, 'link'>
    const text = e.target.value
    changeFormData(formKey, text)
  }

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요."
        buttonText="등록하기"
        onSubmit={async (e) => {
          e.preventDefault()
          if (form.title === '' || form.body === '') {
            setErrorMessage('제목과 내용을 모두 입력하세요')
            return
          }
          fetcher.submit(form, { method: 'post' })
        }}
      >
        <Group>
          <LabelInput
            label="제목"
            name="title"
            onChange={onChange}
            value={form.title}
          />
          <StyledLabelTextArea
            label="내용"
            name="body"
            onChange={onChange}
            value={form.body}
          />
          {errorMessage ? <Message>{errorMessage}</Message> : null}
        </Group>
      </WriteFormTemplate>
    </BasicLayout>
  )
}
export default Intro

/* Remix routes handler */

export const action: ActionFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkAuthenticated(request)
  if (!isAuthenticated) throw new Error('Not logged in')

  const form = await request.formData()

  try {
    await createItem({
      link: form.get('link') as string,
      title: form.get('title') as string,
      body: form.get('body') as string,
    })

    return redirect('/')
  } catch (e) {
    const error = AppError.extract(e)
    throw json(error, { status: error.statusCode })
  }
}

export function CatchBoundary() {
  const caught = useAppErrorCatch()
  const { action } = useWriteContext()
  const navigate = useNavigate()
  useEffect(() => {
    if (caught.status === APP_ERRORS_INFO.InvalidUrl.statusCode) {
      navigate(-1)
      action.setError(caught.data)
    }
  }, [caught, navigate, action])

  return <Intro />
}

// Inner Components

const Group = styled.div`
  ${flexContainer({ direction: 'column' })};
  flex: 1; // grow:1, shrink:1, basis:0%
  gap: 16px;
  padding-bottom: 16px;
`

const StyledLabelTextArea = styled(LabelTextArea)`
  flex: 1; // grow:1, shrink:1, basis:0%
  textarea {
    flex: 1; // grow:1, shrink:1, basis:0%
    resize: none;
    font-family: inherit;
  }
`

const Message = styled.div`
  ${fontStyles({ size: '14px', color: colors.secondary1 })};
  margin-top: 8px;
  text-align: center;
`
