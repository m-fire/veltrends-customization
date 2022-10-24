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
    <Block>
      {thumbnail ? (
        <img className="thumbnail" src={thumbnail} alt={title} />
      ) : null}
    </Block>
  )
}
export default LinkCard

// Inner Components

const Block = styled.div`
  display: flex;
  flex-direction: column;
  .thumbnail {
  }
`
