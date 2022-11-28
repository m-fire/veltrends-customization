import React from 'react'
import styled from 'styled-components'
import { Link } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Item } from '~/core/api/types'
import { colors } from '~/common/style/colors'
import { Earth } from '~/core/component/generate/svg'
import LikeButton from '~/common/component/system/LikeButton'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { useLikeItemAction } from '~/core/hook/useActionOfItem'
import { useOverrideItemById } from '~/core/hook/store/useOverrideItemStore'
import { useAuthUser } from '~/common/context/UserContext'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { flexStyles, fontStyles } from '~/common/style/styled'

type LinkCardProps = {
  item: Item
}

function LinkCard({ item }: LinkCardProps) {
  // define Data
  const {
    id: itemId,
    thumbnail,
    title,
    author,
    body,
    user: { username },
    publisher: { favicon, domain },
    createdAt,
  } = item

  const itemStoreState = useOverrideItemById(itemId)

  // Dialog settings
  const itemStatus = itemStoreState?.itemStatus ?? item.itemStatus
  const openDialog = useOpenDialog({ gotoLogin: true })
  const { likeItem, unlikeItem } = useLikeItemAction()
  const authUser = useAuthUser()
  const toggleLike = async () => {
    if (authUser == null) {
      openDialog('LIKE_ITEM>>LOGIN')
      return
    }
    if (isLiked) {
      await unlikeItem({ itemId, prevItemStatus: itemStatus })
    } else {
      await likeItem({ itemId, prevItemStatus: itemStatus })
    }
  }

  const pastDistance = useDateDistance(createdAt)
  const isLiked = itemStoreState?.isLiked ?? item.isLiked
  const likeCount = itemStoreState?.itemStatus.likeCount ?? itemStatus.likeCount
  const link = `/items/${itemId}`

  return (
    <ListItem>
      <StyledLink to={link}>
        {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}

        <Publisher hasThumbnail={thumbnail != null}>
          {favicon ? <img src={favicon} alt="favicon" /> : <Earth />}

          {author ? (
            <>
              <strong>{author}</strong> {`· ${domain}`}
            </>
          ) : (
            <strong>{domain}</strong>
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
          by <b>{username}</b> · {pastDistance}
        </UserInfo>
      </ItemFooter>
    </ListItem>
  )
}
export default LinkCard

// Inner Components
const ListItem = styled.li`
  ${flexStyles({ direction: 'column' })};
`

// <a></a>
const StyledLink = styled(Link)`
  ${flexStyles({ direction: 'column' })};
  text-decoration: none;
  h3,
  p,
  span {
    margin: 0;
    padding: 0;
  }
  & > h3 {
    ${fontStyles({ size: '18px', weight: 800, color: colors.grey4 })};
    margin-bottom: 8px;
  }
  & > p {
    ${fontStyles({ size: '12px', weight: 500, color: colors.grey3 })};
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
  ${flexStyles()};
  ${fontStyles({
    size: '12px',
    weight: 400,
    color: colors.grey2,
    lineHeight: 1.33,
  })};
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
  ${flexStyles({ alignItems: 'center', justifyContent: 'space-between' })};
  ${fontStyles({
    size: '12px',
    weight: 400,
    color: colors.grey2,
    lineHeight: 1.5,
  })};
  // HeartVote, UserInfo 공통스타일
  & div {
    ${flexStyles({ alignItems: 'center' })};
    gap: 4px;
  }
  & svg {
    color: ${colors.grey2};
  }
`

const LikeCount = styled(motion.div)`
  ${flexStyles()};
  ${fontStyles({
    size: '12px',
    weight: 600,
    color: colors.grey3,
    lineHeight: 1.5,
  })};
`

const UserInfo = styled.div`
  b {
    ${fontStyles({ weight: 600, lineHeight: 1.5 })};
    color: ${colors.grey3};
  }
`
