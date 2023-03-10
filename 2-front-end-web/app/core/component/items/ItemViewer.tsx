import React, { useCallback } from 'react'
import { Item } from '~/core/api/types'
import styled from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { AnimatePresence, motion } from 'framer-motion'
import LikeButton from '~/core/component/items/LikeButton'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useUserState } from '~/common/store/user'
import Earth from '~/core/component/generate/svg/Earth'
import { useItemStateById } from '~/core/hook/store/useItemActionStore'
import { useItemAction } from '~/core/hook/useItemAction'
import BookmarkButton from '~/core/component/items/BookmarkButton'
import { Media } from '~/common/style/media-query'
import { Flex, Font } from '~/common/style/css-builder'

type ItemViewerProps = {
  item: Item
}

function ItemViewer({ item }: ItemViewerProps) {
  const {
    id: itemId,
    thumbnail,
    publisher: { favicon, domain },
    author,
    title,
    body,
    createdAt,
    link,
  } = item

  // Dialog settings
  const stateById = useItemStateById(itemId)
  const itemStatus = stateById?.itemStatus ?? item.itemStatus
  const openDialog = useOpenDialog()
  const user = useUserState().user ?? item.user

  const isLiked = stateById?.isLiked ?? item.isLiked
  const isBookmarked = stateById?.isBookmarked ?? item.isBookmarked
  const { likeItem, unlikeItem, bookmarkItem, unbookmarkItem } = useItemAction()

  const toggleActionByType = useCallback(
    async (type: ActionType) => {
      if (!user) {
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

  return (
    <Block>
      {thumbnail ? (
        <a href={link}>
          <Thumbnail src={thumbnail} alt={title} />
        </a>
      ) : null}

      <Content>
        <a href={link}>
          <Publisher hasThumbnail={thumbnail != null}>
            {favicon ? <img src={favicon} alt="favicon" /> : <Earth />}

            {author ? (
              <>
                <strong>{author}</strong> {`?? ${domain}`}
              </>
            ) : (
              <strong>{domain}</strong>
            )}
          </Publisher>

          <Title>{title}</Title>
        </a>
        {/*<OriginLink href={link}>*/}
        {/*  ??????*/}
        {/*  <Shortcut />*/}
        {/*</OriginLink>*/}

        <ActionButtons>
          <LikeButton
            size="medium"
            isLiked={isLiked}
            disabled={!user}
            onClick={() => toggleActionByType('LIKE_ITEM')}
          />
          <BookmarkButton
            size="medium"
            isBookmarked={isBookmarked}
            disabled={!user}
            onClick={() => toggleActionByType('BOOKMARK_ITEM')}
          />
        </ActionButtons>

        <Body>{body}</Body>

        <Footer>
          <BottomActionBlock>
            <LikeButton
              size="large"
              isLiked={isLiked}
              disabled={!user}
              onClick={() => toggleActionByType('LIKE_ITEM')}
            />

            <AnimatePresence initial={false}>
              {likeCount === 0 ? null : (
                <LikesCount
                  key="likeCount"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: -26, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  ????????? {likeCount.toLocaleString()}
                </LikesCount>
              )}
            </AnimatePresence>
          </BottomActionBlock>

          <UserInfo>
            writen by <b>{user?.username}</b> ?? <span>{pastDistance}</span>
          </UserInfo>
        </Footer>
      </Content>
    </Block>
  )
}
export default ItemViewer

// Inner Components

const Block = styled.div`
  ${Flex.container().direction('column').create()};
  & > a {
    display: block;
  }
`

const Thumbnail = styled.img`
  // Card ???????????? ?????????, ???????????? ?????? ????????? ??????????????? ???????????? ?????? ??????
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 0 16px rgba(0 0 0 / 15%);
`

const Content = styled.div`
  padding: 30px;
  border-bottom: 4px solid ${globalColors.grey1};
  & > a {
    ${Font.presets.noneTextDecoration};
    display: block;
  }
`

const Publisher = styled.div<{ hasThumbnail: boolean }>`
  ${Flex.container().alignItems('center').create()};
  ${Font.style()
    .size(12)
    .weight(400)
    .color(globalColors.grey2)
    .lineHeight(1.33)
    .create()};
  gap: 4px;
  margin-bottom: 8px;
  img,
  svg {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 2px;
  }
  strong {
    ${Font.style().size(12).weight(600).color(globalColors.grey3).create()};
  }
  ${Media.minWidth.tablet} {
    font-size: 16px;
    strong {
      font-size: 16px;
    }
    gap: 8px;
    margin-bottom: 12px;
    img,
    svg {
      width: 24px;
      height: 24px;
      border-radius: 0.25vw;
    }
  }
  ${Media.minWidth.desktop} {
    font-size: 20px;
    strong {
      font-size: 20px;
    }
    gap: 12px;
    margin-bottom: 16px;
    img,
    svg {
      width: 26px;
      height: 26px;
    }
  }
`

const Title = styled.h2`
  ${Font.style()
    .size(20)
    .weight(800)
    .color(globalColors.grey5)
    .letterSpacing('-0.5px')
    .create()};
  ${Media.minWidth.tablet} {
    font-size: 32px;
  }
  ${Media.minWidth.desktop} {
    font-size: 40px;
  }
  ${Media.minWidth.xwide} {
    font-size: 48px;
  }
  margin-top: 0;
  margin-bottom: 8px;
`

const ActionButtons = styled.div`
  ${Flex.container().alignItems('center').justifyContent('flex-end').create()};
  gap: 8px;
  margin-bottom: 48px;
`

const Body = styled.p`
  ${Font.style()
    .size(16)
    .weight(500)
    .color(globalColors.grey4)
    .lineHeight(1.5)
    .letterSpacing('-0.5px')
    .whiteSpace('pre-wrap')
    .wordBreak('keep-all')
    .create()};
  ${Media.minWidth.tablet} {
    font-size: 22px;
  }
  ${Media.minWidth.desktop} {
    font-size: 24px;
  }
  ${Media.minWidth.xwide} {
    font-size: 26px;
  }
  margin-top: 0;
  margin-bottom: 40px;
`

const BottomActionBlock = styled.div`
  ${Flex.container().direction('column').alignItems('center').create()};
  gap: 4px;
  margin-bottom: 40px;
`

const UserInfo = styled.div`
  ${Flex.container().justifyContent('end').create()};
  ${Font.style()
    .size(13)
    .weight(400)
    .color(globalColors.grey4)
    .lineHeight(1.33)
    .create()};
  gap: 4px;
  & b {
    font-weight: 700;
  }
`

const LikesCount = styled(motion.div)`
  ${Flex.container().create()};
  ${Font.style()
    .size(12)
    .weight(600)
    .color(globalColors.grey3)
    .lineHeight(1.5)
    .create()};
  ${Media.minWidth.tablet} {
    font-size: 16px;
  }
  ${Media.minWidth.desktop} {
    font-size: 20px;
  }
`

const Footer = styled.div`
  ${Flex.container().direction('column').create()};
`
