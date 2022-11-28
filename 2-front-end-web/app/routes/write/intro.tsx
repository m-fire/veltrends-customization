import { ChangeEventHandler, useEffect, useState } from 'react'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ActionFunction, json, redirect } from '@remix-run/node'
import styled from 'styled-components'
import LabelInput from '~/components/system/LabelInput'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import LabelTextArea from '~/components/system/LabelTextArea'
import { Authenticator } from '~/common/api/auth'
import { createItem } from '~/common/api/items'
import { useWriteContext } from '~/common/context/WriteContext'
import AppError, { APP_ERRORS_INFO } from '~/common/error/AppError'
import { useAppErrorCatch } from '~/common/hooks/useAppErrorCatch'
import { colors } from '~/common/style/colors'
import { flexStyles, fontStyles } from '~/common/style/styled'

type IntroProps = {}

function Intro({}: IntroProps) {
  const {
    state: { form },
    actions,
  } = useWriteContext()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /* Remix submitting hooks */
  const initialForm = { title: '', body: '' }
  const fetcher = useFetcher<typeof initialForm>()

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    e,
  ) => {
    const key = e.target.name as keyof Omit<typeof form, 'link'>
    const { value } = e.target
    actions.change(key, value)
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
          <IntroLabelTextArea
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

  const link = form.get('link') as string
  const title = form.get('title') as string
  const body = form.get('body') as string
  try {
    await createItem({ link, title, body })

    return redirect('/')
  } catch (e) {
    const error = AppError.extract(e)
    throw json(error, { status: error.statusCode })
  }
}

export function CatchBoundary() {
  const caught = useAppErrorCatch()
  const { actions } = useWriteContext()
  const navigate = useNavigate()
  useEffect(() => {
    if (caught.status === APP_ERRORS_INFO.InvalidUrl.statusCode) {
      navigate(-1)
      actions.setError(caught.data)
    }
  }, [caught, navigate, actions])

  return <Intro />
}

// Inner Components

const Group = styled.div`
  ${flexStyles({ direction: 'column', flex: 1 })};
  gap: 16px;
  padding-bottom: 16px;
`

const IntroLabelTextArea = styled(LabelTextArea)`
  flex: 1;
  textarea {
    flex: 1;
    resize: none;
    font-family: inherit;
  }
`

const Message = styled.div`
  ${fontStyles({ size: '14px', color: colors.secondary1 })};
  margin-top: 8px;
  text-align: center;
`
