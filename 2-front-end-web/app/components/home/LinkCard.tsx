import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Item } from '~/common/api/types'
import { colors } from '~/common/style/colors'

type LinkCardProps = {
  item: Item
}

function LinkCard({ item }: LinkCardProps) {
  const { thumbnail, title } = item

  return (
    <ListItem>
      {title}::thunb: {thumbnail}
      {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}
    </ListItem>
  )
}
export default LinkCard

// Inner Components

const ListItem = styled.li`
  display: flex;
  flex-direction: column;
`

const Thumbnail = styled.img`
  display: block; // 이미지는 inline 이므로, 불필요한 line-height 제거
  width: 100%;
  aspect-ratio: 280/100; // w x h 값으로
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 0 3px rgba(0 0 0 / 15%);
`
