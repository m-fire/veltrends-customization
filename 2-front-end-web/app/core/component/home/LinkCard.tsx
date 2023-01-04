import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from '@remix-run/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Item } from '~/core/api/types'
import { colors } from '~/common/style/colors'
import { Earth } from '~/core/component/generate/svg'
import LikeButton from '~/core/component/items/LikeButton'
import BookmarkButton from '~/core/component/items/BookmarkButton'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { useAuthUser } from '~/common/context/UserContext'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useItemStateById } from '~/core/hook/store/useItemActionStore'
import { useItemAction } from '~/core/hook/useItemAction'
import { screen } from '~/common/style/media-query'
import Flex from '~/common/style/css-flex'
import Font from '~/common/style/css-font'

type LinkCardProps = {
  item: Item
}

function LinkCard({ item }: LinkCardProps) {
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

  // Dialog settings
  const stateById = useItemStateById(itemId)
  const itemStatus = stateById?.itemStatus ?? item.itemStatus
  const openDialog = useOpenDialog()
  const authUser = useAuthUser()

  const isLiked = stateById?.isLiked ?? item.isLiked
  const isBookmarked = stateById?.isBookmarked ?? item.isBookmarked
  const { likeItem, unlikeItem, bookmarkItem, unbookmarkItem } = useItemAction()

  const toggleActionByType = useCallback(
    async (type: ActionType) => {
      if (!authUser) {
        openDialog(type, { gotoLogin: true })
        return
      }
      switch (type) {
        case 'LIKE_ITEM': {
          isLiked
            ? await unlikeItem(itemId, itemStatus, isLiked)
            : await likeItem(itemId, itemStatus, isLiked)
          break
        }
        case 'BOOKMARK_ITEM': {
          isBookmarked
            ? await unbookmarkItem(itemId, isBookmarked)
            : await bookmarkItem(itemId, isBookmarked)
          break
        }
      }
    },
    [stateById],
  )
  type ActionType = Extract<
    Parameters<ReturnType<typeof useOpenDialog>>[0],
    'LIKE_ITEM' | 'BOOKMARK_ITEM'
  >

  const pastDistance = useDateDistance(createdAt)
  const likeCount = stateById?.itemStatus?.likeCount ?? itemStatus.likeCount
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
          <LinkCountWrapper>
            <LikeCount
              key="likeCount"
              initial={{ height: 0, opacity: 0, y: 10 }}
              animate={{ height: 22, opacity: 1, y: 0 }}
              transition={{ stiffness: 100 }}
              exit={{ height: 0, opacity: 0 }}
            >
              좋아요 {likeCount.toLocaleString()}
            </LikeCount>
          </LinkCountWrapper>
        )}
      </AnimatePresence>

      <ItemFooter>
        <ActionButtons>
          <LikeButton
            onClick={() => toggleActionByType('LIKE_ITEM')}
            isLiked={isLiked}
            disabled={!authUser}
          />

          <BookmarkButton
            onClick={() => toggleActionByType('BOOKMARK_ITEM')}
            isBookmarked={isBookmarked}
            disabled={!authUser}
          />
        </ActionButtons>

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
  ${Flex.Container.style().direction('column').create()};
`

const StyledLink = styled(Link)`
  ${Flex.Container.style().direction('column').create()};
  text-decoration: none;
  h3,
  p,
  span {
    margin: 0;
    padding: 0;
  }
  & > h3 {
    ${Font.style().size('18px').weight(800).color(colors.grey4).create()};
    margin-bottom: 8px;
    ${screen.desktop} {
      font-size: 24px;
    }
  }
  & > p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    ${Font.style().size('12px').weight(500).color(colors.grey3).create()};
    height: 70px;
    margin-top: 0;
    margin-bottom: 8px;

    ${screen.tablet} {
      font-size: 14px;
      height: 70px;
    }
  }
`

const LinkCountWrapper = styled.div`
  ${screen.tablet} {
    height: 26px;
  }
`

const Thumbnail = styled.img`
  display: block; // 이미지는 inline 이므로, 불필요한 line-height 제거
  width: 100%;
  //aspect-ratio: 280/100; // 비율 고정값
  max-height: 40vh; // 이미지 height 가 최대값 아래로 유동적 변경
  ${screen.tablet} {
    aspect-ratio: 288/192; // 비율 고정값
  }
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 0 3px rgba(0 0 0 / 10%);

  margin-bottom: 12px;
`

const Publisher = styled.div<{ hasThumbnail: boolean }>`
  ${Flex.Container.style().create()};
  ${Font.style()
    .size('12px')
    .weight(400)
    .color(colors.grey2)
    .lineHeight(1.33)
    .create()};
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
    ${Font.style()
      .size('12px')
      .weight(600)
      .color(colors.grey3)
      .lineHeight(1.33)
      .create()};
  }
`

const ItemFooter = styled.div`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('space-between')
    .create()};
  ${Font.style()
    .size('12px')
    .weight(400)
    .color(colors.grey2)
    .lineHeight(1.5)
    .create()};
  // HeartVote, UserInfo 공통스타일
  // 이 코드 때문에 하위 컴포넌트의 SVG 컬러가 적용되지 않았음.
  // & svg {
  //   color: ${colors.grey2};
  // }
`

const LikeCount = styled(motion.div)`
  ${Flex.Container.style().create()};
  ${Font.style()
    .size('12px')
    .weight(600)
    .color(colors.grey3)
    .lineHeight(1.5)
    .create()};
`

const ActionButtons = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  gap: 8px;
`

const UserInfo = styled.div`
  ${Flex.Container.style().alignItems('center').create()};
  gap: 4px;
  b {
    ${Font.style().weight(600).lineHeight(1.5).create()};
    color: ${colors.grey3};
  }
`
