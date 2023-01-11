import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useLoaderData, useNavigate } from '@remix-run/react'
import styled from 'styled-components'
import { appColors } from '~/core/style/app-colors'
import AppBaseLayout from '~/core/component/template/AppBaseLayout'
import WriteFormTemplate from '~/core/component/routes/write/WriteFormTemplate'
import LabelInput from '~/core/component/element/LabelInput'
import LabelTextArea from '~/common/component/element/LabelTextArea'
import { Item } from '~/core/api/types'
import { json, LoaderFunction } from '@remix-run/node'
import { Requests } from '~/common/util/https'
import { getItem, updateItem } from '~/core/api/items'
import { Flex, Font } from '~/common/style/css-builder'

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
    <AppBaseLayout title="수정" hasBackButton>
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
    </AppBaseLayout>
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
  ${Flex.Item.flex1};
  ${Flex.Container.style().direction('column').create()};
  gap: 16px;
  padding-bottom: 16px;
`

const LinkLabelTextArea = styled(LabelTextArea)`
  & textarea {
    ${Font.style().size('14px').create()};
    padding: 8px;
  }
`

const BodyLabelTextArea = styled(LabelTextArea)`
  ${Flex.Item.flex1};
  textarea {
    ${Flex.Item.flex1};
    resize: none;
    font-family: inherit;
  }
`

const Message = styled.div`
  ${Font.style()
    .size('14px')
    .color(appColors.secondary1)
    .textAlign('center')
    .create()};
  margin-top: 8px;
`
