import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { SearchedItem } from '~/core/api/types'
import { Earth } from '~/core/component/generate/svg'

type SearchResultCardProps = {
  item: SearchedItem
}

function SearchResultCard({ item }: SearchResultCardProps) {
  const { publisher, author, highlight } = item
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
    </Block>
  )
}
export default SearchResultCard

// Inner Components

const Block = styled.div`
  h3 {
    ${fontStyles({
      size: '16px',
      weight: 600,
      color: colors.grey4,
      lineHeight: 1.5,
    })};
    margin-top: 0;
    margin-bottom: 0;
    em {
      font-weight: 800;
    }
  }

  em {
    color: ${colors.primary1};
    font-style: normal;
  }

  p {
    ${fontStyles({
      size: '14px',
      color: colors.grey3,
      lineHeight: 1.5,
    })};
    margin-top: 8px;
    margin-bottom: 8px;
    em {
      font-weight: 600;
    }
  }
`

const Publisher = styled.div`
  ${flexStyles({ alignItems: 'center' })};
  ${fontStyles({
    size: '14px',
    color: colors.grey4,
    lineHeight: 1.5,
  })};
  margin-bottom: 4px;

  img,
  svg {
    display: block;
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`
