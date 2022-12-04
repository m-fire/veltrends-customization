import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useLoaderData, useNavigate } from '@remix-run/react'
import styled from 'styled-components'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { colors } from '~/common/style/colors'
import BasicLayout from '~/common/component/layout/BasicLayout'
import WriteFormTemplate from '~/core/component/write/WriteFormTemplate'
import LabelInput from '~/common/component/system/LabelInput'
import LabelTextArea from '~/common/component/system/LabelTextArea'
import { Item } from '~/core/api/types'
import { json, LoaderFunction } from '@remix-run/node'
import { Requests } from '~/common/util/https'
import { getItem, updateItem } from '~/core/api/items'

function Edit() {
  const item = useLoaderData<Item>()
  const [form, setForm] = useState({
    link: item.link,
    title: item.title,
    body: item.body,
  })

  const onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    e,
  ) => {
    const formKey = e.target.name as keyof typeof form
    const text = e.target.value
    setForm({ ...form, [formKey]: text })
  }

  const navigate = useNavigate()
  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault()
    //todo: handle loading and error
    await updateItem({
      ...form,
      itemId: item.id,
    })
    // item 페이지에서 수정되었으므로, 머물렀던 이전 item 페이지로 이동
    navigate(`/items/${item.id}`)
  }

  const errorMessage = null

  return (
    <BasicLayout title="수정" hasBackButton>
      <WriteFormTemplate buttonText="수정하기" onSubmit={onSubmit}>
        <Group>
          <LinkLabelTextArea
            label="URL"
            name="link"
            value={form.link}
            onChange={onChange}
          />

          <LabelInput
            label="제목"
            name="title"
            value={form.title}
            onChange={onChange}
          />

          <BodyLabelTextArea
            label="내용"
            name="body"
            value={form.body}
            onChange={onChange}
          />

          {errorMessage ? <Message>{errorMessage}</Message> : null}
        </Group>
      </WriteFormTemplate>
    </BasicLayout>
  )
}
export default Edit

/* Remix routes handler */

export const loader: LoaderFunction = async ({ request }) => {
  // @todo: validate itemId
  const query = Requests.parseUrlParams<{ itemId: string }>(request.url)
  const itemId = parseInt(query.itemId, 10)

  const item = await getItem(itemId)

  return json(item)
}

// Inner Components

const Group = styled.div`
  ${flexStyles({ direction: 'column', flex: 1 })};
  gap: 16px;
  padding-bottom: 16px;
`

const LinkLabelTextArea = styled(LabelTextArea)`
  & textarea {
    ${fontStyles({ size: '14px' })};
    padding: 8px;
  }
`

const BodyLabelTextArea = styled(LabelTextArea)`
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