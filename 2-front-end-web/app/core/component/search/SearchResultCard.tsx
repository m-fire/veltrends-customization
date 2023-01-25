import React from 'react'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
import { SearchedItem } from '~/core/api/types'
import { Earth } from '~/core/component/generate/svg'
import { Flex, Font } from '~/common/style/css-builder'

type SearchResultCardProps = {
  item: SearchedItem
}

function SearchResultCard({ item }: SearchResultCardProps) {
  const { publisher, author, highlight, likeCount } = item
  return (
    <Block>
      <Publisher>
        {publisher.favicon ? (
          <img src={publisher.favicon} alt="favicon" />
        ) : (
          <Earth />
        )}
        {author ? `${author} · ` : ''}
        {publisher.name}
      </Publisher>

      {/* dangerouslySetInnerHTML:  DOM 의 innerHTML 사용을 위한 React 용 대체방법 */}
      {/** @todo: Secure this code **/}
      <h3 dangerouslySetInnerHTML={{ __html: highlight.title }} />
      <p dangerouslySetInnerHTML={{ __html: highlight.body }} />

      {likeCount > 0 ? (
        <LikeCount>좋아요 {likeCount.toLocaleString()}</LikeCount>
      ) : null}
    </Block>
  )
}
export default SearchResultCard

// Inner Components

const Block = styled.div`
  h3 {
    ${Font.style()
      .size(16)
      .weight(600)
      .color(globalColors.grey4)
      .lineHeight(1.5)
      .create()};
    margin-top: 0;
    margin-bottom: 0;
    em {
      font-weight: 800;
    }
  }

  em {
    color: ${appColors.primary1};
    font-style: normal;
  }

  p {
    ${Font.style().size(14).color(globalColors.grey3).lineHeight(1.5).create()};
    margin-top: 8px;
    margin-bottom: 8px;
    em {
      font-weight: 600;
    }
  }
`

const LikeCount = styled.div`
  ${Flex.container().create()};
  ${Font.style().size(12).weight(600).color(globalColors.grey3).create()};
`

const Publisher = styled.div`
  ${Flex.container().alignItems('center').create()};
  ${Font.style().size(14).color(globalColors.grey4).lineHeight(1.5).create()};
  margin-bottom: 4px;

  img,
  svg {
    display: block;
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`
