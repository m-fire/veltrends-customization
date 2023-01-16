import { ChangeEventHandler, useEffect, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ActionFunction, json, redirect } from '@remix-run/node'
import styled from 'styled-components'
import LabelInput from '~/core/component/LabelInput'
import BasicLayout from '~/core/component/home/BasicLayout'
import WriteForm from '~/core/component/write/WriteForm'
import LabelTextArea from '~/common/component/element/LabelTextArea'
import { Authenticator } from '~/core/api/auth'
import { createItem } from '~/core/api/items'
import { useWriteContext } from '~/core/context/WriteContext'
import AppError, { APP_ERRORS_INFO } from '~/common/error/AppError'
import { useAppErrorCatch } from '~/common/hook/useAppErrorCatch'
import { appColors } from '~/core/style/app-colors'
import { Flex, Font } from '~/common/style/css-builder'

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
      <WriteForm
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
      </WriteForm>
    </BasicLayout>
  )
}
export default Intro

/* Remix routes handler */

export const action: ActionFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkAuthenticated(request)
  if (!isAuthenticated) throw new Error('Not logged in')

  const form = await request.formData()
  const link = form.get('link') as string
  const title = form.get('title') as string
  const body = form.get('body') as string

  try {
    const item = await createItem({ link, title, body })

    return redirect(`/items/${item.id}`)
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
  ${Flex.item().flex(1).create()};
  ${Flex.container().direction('column').create()};
  gap: 16px;
  padding-bottom: 16px;
`

const StyledLabelTextArea = styled(LabelTextArea)`
  ${Flex.item().flex(1).create()};
  textarea {
    ${Flex.item().flex(1).create()};
    resize: none;
    font-family: inherit;
  }
`

const Message = styled.div`
  ${Font.style()
    .size(14)
    .color(appColors.secondary1)
    .textAlign('center')
    .create()};
  margin-top: 8px;
`
