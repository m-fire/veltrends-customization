import React from 'react'
import styled, { css, CSSProperties } from 'styled-components'
import { Link } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Item } from '~/common/api/types'
import { colors } from '~/common/style/colors'
import { Earth } from '~/components/generate/svg'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import LikeButton from '~/components/system/LikeButton'
import { useItemOverrideById } from '~/common/context/ItemStatusContext'
import { useItemLikeActions } from '~/common/hooks/useItemStatusActions'
import { useAuthUser } from '~/common/context/UserContext'
import { useOpenDialog } from '~/common/hooks/useOpenDialog'
import { useItemOverrideStateById } from '~/common/hooks/useItemOverrideStore'

type LinkCardProps = {
  item: Item
}

function LinkCard({ item }: LinkCardProps) {
  // Dialog settings
  const { like, unlike } = useItemLikeActions()
  const openDialog = useOpenDialog({ gotoLogin: true })
  const authUser = useAuthUser()
  const toggleLike = async () => {
    if (!authUser) {
      openDialog('LIKE_ITEM>>LOGIN')
      return
    }
    if (isLiked) {
      await unlike(itemId, itemStatus)
    } else {
      await like(itemId, itemStatus)
    }
  }

  // define Data
  const {
    id: itemId,
    thumbnail,
    title,
    author,
    body,
    user,
    publisher,
    createdAt,
  } = item
  const pastDistance = useDateDistance(createdAt)

  const itemOverride = useItemOverrideStateById(itemId)
  const itemStatus = itemOverride?.itemStatus ?? item.itemStatus
  const likeCount = itemOverride?.itemStatus.likeCount ?? itemStatus.likeCount
  const isLiked = itemOverride?.isLiked ?? item.isLiked
  const link = `/items/${item.id}`

  return (
    <ListItem>
      <StyledLink to={link}>
        {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}

        <Publisher hasThumbnail={!!thumbnail}>
          {publisher.favicon ? (
            <img src={publisher.favicon} alt="favicon" />
          ) : (
            <Earth />
          )}

          {author ? (
            <>
              <strong>{author}</strong> {`· ${publisher.domain}`}
            </>
          ) : (
            <strong>{publisher.domain}</strong>
          )}
        </Publisher>
        <h3>{title}</h3>

        {body ? <p>{body}</p> : null}
      </StyledLink>

      <AnimatePresence initial={false}>
        {likeCount === 0 ? null : (
          <LikeCount
            key="likeCount"
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: 22, opacity: 1, y: 0 }}
            transition={{ stiffness: 100 }}
            exit={{ height: 0, opacity: 0 }}
          >
            좋아요 {likeCount.toLocaleString()}
          </LikeCount>
        )}
      </AnimatePresence>

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
  ${displayFlex({ direction: 'column' })};
`

// <a></a>
const StyledLink = styled(Link)`
  ${displayFlex({ direction: 'column' })};
  text-decoration: none;
  h3,
  p,
  span {
    margin: 0;
    padding: 0;
  }
  & > h3 {
    ${fontStyles({ size: '18px', weight: 800, color: colors.grey4 })}
    margin-bottom: 8px;
  }
  & > p {
    ${fontStyles({ size: '12px', weight: 500, color: colors.grey3 })}
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
  ${displayFlex()};
  ${fontStyles({
    size: '12px',
    weight: 400,
    color: colors.grey2,
    lineHeight: 1.33,
  })}
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
    ${fontStyles({
      size: '12px',
      weight: 600,
      color: colors.grey3,
      lineHeight: 1.33,
    })};
  }
`

const ItemFooter = styled.div`
  ${displayFlex({ alignItems: 'center', justifyContent: 'space-between' })};
  ${fontStyles({
    size: '12px',
    weight: 400,
    color: colors.grey2,
    lineHeight: 1.5,
  })};
  // HeartVote, UserInfo 공통스타일
  & div {
    ${displayFlex({ alignItems: 'center' })};
    gap: 4px;
  }
  & svg {
    color: ${colors.grey2};
  }
`

const LikeCount = styled(motion.div)`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.grey3};
  line-height: 1.5;
  display: flex;
`

const UserInfo = styled.div`
  b {
    ${fontStyles({ weight: 600, lineHeight: 1.5 })}
    color: ${colors.grey3};
  }
`

export function fontStyles({
  size,
  weight,
  color,
  lineHeight,
  letterSpacing,
}: FontStylesParams) {
  return css`
    ${size &&
    css`
      font-size: ${size};
    `}
    ${weight &&
    css`
      font-weight: ${weight};
    `}
    ${color &&
    css`
      color: ${color};
    `}
    ${lineHeight &&
    css`
      line-height: ${lineHeight};
    `}
    ${letterSpacing &&
    css`
      letter-spacing: ${letterSpacing};
    `}
  `
}
type FontStylesParams = {
  size?: CSSProperties['fontSize'] | null
  weight?: CSSProperties['fontWeight'] | null
  color?: CSSProperties['color'] | null
  lineHeight?: CSSProperties['lineHeight'] | null
  letterSpacing?: CSSProperties['letterSpacing'] | null
}

export function displayFlex<OptKey extends keyof CSSProperties>({
  direction,
  alignItems,
  justifyContent,
}: FlexStylesParams = {}) {
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

type FlexStylesParams = {
  direction?: CSSProperties['flexDirection'] | null
  alignItems?: CSSProperties['alignItems'] | null
  justifyContent?: CSSProperties['justifyContent'] | null
}
