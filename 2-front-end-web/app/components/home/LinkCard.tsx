import React from 'react'
import styled, { css, CSSProperties } from 'styled-components'
import { Item } from '~/common/api/types'
import { colors } from '~/common/style/colors'
import { Earth, HeartFill, HeartOutline } from '~/components/generate/svg'
import { useDateDistanceRefresh } from '~/common/hooks/useDateDistanceRefresh'
import LikeButton from '~/components/system/LikeButton'
import { useItemOverrideById } from '~/context/ItemStatusContext'
import { useItemLikeActions } from '~/common/hooks/useItemStatusActions'

type LinkCardProps = {
  item: Item
}

function LinkCard({ item }: LinkCardProps) {
  const {
    id,
    thumbnail,
    title,
    author,
    body,
    user,
    publisher,
    createdAt,
    itemStatus,
  } = item

  const pastDistance = useDateDistanceRefresh(createdAt)
  const itemOverride = useItemOverrideById(id)
  const likes = itemOverride?.itemStatus.likes ?? itemStatus.likes
  const isLiked = itemOverride?.isLiked ?? item.isLiked

  const { like, unlike } = useItemLikeActions()
  const toggleLike = async () => {
    if (isLiked) {
      await unlike(id, itemStatus)
    } else {
      await like(id, itemStatus)
    }
  }

  return (
    <ListItem>
      {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}

      <Publisher hasThumbnail={!!thumbnail}>
        {publisher.favicon ? (
          <img src={publisher.favicon} alt="favicon" />
        ) : (
          <Earth />
        )}
        {author ? (
          <>
            <strong>{author}</strong>
            {`· ${domain}`}
          </>
        ) : (
          <strong>{domain}</strong>
        )}
      </Publisher>
      <h3>{title}</h3>
      {body && <p>{body}</p>}

      <ItemFooter>
        <LikeButton onClick={toggleLike} isLiked={isLiked} />
        <UserInfo>
          by <b>{user.username}</b> · {pastDistance}
        </UserInfo>
      </ItemFooter>
    </ListItem>
  )
}
export default LinkCard

// Inner Components

const ListItem = styled.li`
  ${displayFlexStyles('column')};
  h3,
  p,
  span {
    margin: 0;
    padding: 0;
  }
  & > h3 {
    ${fontStyles('18px', 800, colors.grey4)};
    margin-bottom: 8px;
  }
  & > p {
    ${fontStyles('12px', 500, colors.grey3)};
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

  margin-bottom: 12px;
`

const Publisher = styled.div<{ hasThumbnail: boolean }>`
  display: flex;
  ${fontStyles('12px', 400, colors.grey2, 1.33)};
  gap: 4px;
  margin-bottom: 2px;
  img,
  svg {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 2px;
  }
  strong {
    ${fontStyles('12px', 600, colors.grey3, 1.33)};
  }
`

const ItemFooter = styled.div`
  ${displayFlexStyles(null, 'center', 'space-between')};
  ${fontStyles('12px', 400, colors.grey2, 1.5)};
  // HeartVote, UserInfo 공통스타일
  div {
    ${displayFlexStyles(null, 'center')};
    gap: 4px;
  }
`

const Vote = styled.div`
  b {
    ${fontStyles(null, 700, null, 1.5)};
    color: ${colors.grey4};
  }
`

const UserInfo = styled.div`
  b {
    ${fontStyles(null, 600, null, 1.5)};
    color: ${colors.grey3};
  }
`

function fontStyles(
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

function displayFlexStyles<OptKey extends keyof CSSProperties>(
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
