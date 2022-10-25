import React from 'react'
import styled, { css, CSSProperties } from 'styled-components'
import { Item } from '~/common/api/types'
import { colors } from '~/common/style/colors'
import { Earth } from '~/components/generate/svg'

type LinkCardProps = {
  item: Item
}

function LinkCard({
  item: {
    id,
    link,
    thumbnail,
    title,
    author,
    body,
    user,
    publisher,
    createdAt,
    updatedAt,
  },
}: LinkCardProps) {
  return (
    <ListItem>
      {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}
      <h3>{title}</h3>
      <Publisher>
        {publisher.favicon ? (
          <img src={publisher.favicon} alt="favicon" />
        ) : (
          <Earth />
        )}
        {author && (
          <>
            <strong>{author}</strong> {`· `}
          </>
        )}
        {author ? `${publisher.domain}` : <strong>{publisher.domain}</strong>}
      </Publisher>
      {body && <p>{body}</p>}
    </ListItem>
  )
}
export default LinkCard

// Inner Components

const ListItem = styled.li`
  ${getFlexBlockStyles('column')};
  & h3,
  p,
  span {
    margin: 0;
    padding: 0;
  }
  & h3 {
    ${getFontStyles('18px', 800, colors.grey4)};
    margin-bottom: 2px;
  }
  p {
    ${getFontStyles('12px', 500, colors.grey3)};
    display: block;
    margin-bottom: 8px;
  }
`

const Thumbnail = styled.img`
  display: block; // 이미지는 inline 이므로, 불필요한 line-height 제거
  width: 100%;
  aspect-ratio: 280/100; // w x h 값으로
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 0 3px rgba(0 0 0 / 15%);

  margin-bottom: 8px;
`

const Publisher = styled.div`
  display: flex;
  ${getFontStyles('12px', 400, colors.grey2, 1.33)};
  gap: 4px;
  margin-bottom: 8px;
  img,
  svg {
    display: inline-block;
    width: 18px;
  }
  strong {
    ${getFontStyles('12px', 600, colors.grey3, 1.33)};
  }
`

function getFontStyles(
  fontSize?: CSSProperties['fontSize'] | null,
  fontWeight?: CSSProperties['fontWeight'] | null,
  color?: CSSProperties['color'] | null,
  lineHeight?: CSSProperties['lineHeight'] | null,
) {
  return css`
    ${fontSize &&
    css`
      font-size: ${fontSize};
    `}
    ${fontWeight &&
    css`
      font-weight: ${fontWeight};
    `}
    ${color &&
    css`
      color: ${color};
    `}
    ${lineHeight &&
    css`
      line-height: ${lineHeight};
    `}
  `
}

function getFlexBlockStyles<OptKey extends keyof CSSProperties>(
  direction?: CSSProperties['flexDirection'] | null,
  alignItems?: CSSProperties['alignItems'] | null,
  justifyContent?: CSSProperties['justifyContent'] | null,
) {
  return css`
    display: flex;
    ${direction &&
    css`
      flex-direction: ${direction};
    `}
    ${alignItems &&
    css`
      align-items: ${alignItems};
    `}
    ${justifyContent &&
    css`
      justify-content: ${justifyContent};
    `}
  `
}
