import React, { useCallback } from 'react'
import { Item } from '~/core/api/types'
import styled from 'styled-components'
import { colors } from '~/core/style/colors'
import { AnimatePresence, motion } from 'framer-motion'
import LikeButton from '~/core/component/items/LikeButton'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useAuthUser } from '~/common/context/UserContext'
import Earth from '~/core/component/generate/svg/Earth'
import { useItemStateById } from '~/core/hook/store/useItemActionStore'
import { useItemAction } from '~/core/hook/useItemAction'
import BookmarkButton from '~/core/component/items/BookmarkButton'
import { screen } from '~/common/style/media-query'
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
    user,
    createdAt,
    link,
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
                <strong>{author}</strong> {`· ${domain}`}
              </>
            ) : (
              <strong>{domain}</strong>
            )}
          </Publisher>

          <Title>{title}</Title>
        </a>
        {/*<OriginLink href={link}>*/}
        {/*  이동*/}
        {/*  <Shortcut />*/}
        {/*</OriginLink>*/}

        <ActionButtons>
          <LikeButton
            size="medium"
            isLiked={isLiked}
            disabled={!authUser}
            onClick={() => toggleActionByType('LIKE_ITEM')}
          />
          <BookmarkButton
            size="medium"
            isBookmarked={isBookmarked}
            disabled={!authUser}
            onClick={() => toggleActionByType('BOOKMARK_ITEM')}
          />
        </ActionButtons>

        <Body>{body}</Body>

        <Footer>
          <BottomActionBlock>
            <LikeButton
              size="large"
              isLiked={isLiked}
              disabled={!authUser}
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
                  좋아요 {likeCount.toLocaleString()}
                </LikesCount>
              )}
            </AnimatePresence>
          </BottomActionBlock>

          <UserInfo>
            writen by <b>{user.username}</b> · <span>{pastDistance}</span>
          </UserInfo>
        </Footer>
      </Content>
    </Block>
  )
}
export default ItemViewer

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().direction('column').create()};
  & > a {
    display: block;
  }
`

const Thumbnail = styled.img`
  // Card 뷰에서와 다르게, 가로폭을 가득 체우고 세로길이를 고정하기 위한 설정
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 0 16px rgba(0 0 0 / 15%);
`

const Content = styled.div`
  padding: 30px;
  border-bottom: 4px solid ${colors.grey1};
  & > a {
    display: block;
    text-decoration: none;
  }
`

const Publisher = styled.div<{ hasThumbnail: boolean }>`
  ${Flex.Container.style().alignItems('center').create()};
  ${Font.style()
    .size('12px')
    .weight(400)
    .color(colors.grey2)
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
    ${Font.style().size('12px').weight(600).color(colors.grey3).create()};
  }
  ${screen.tablet} {
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
  ${screen.desktop} {
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
    .size('20px')
    .weight(800)
    .color(colors.grey5)
    .letterSpacing('-0.5px')
    .create()};
  ${screen.tablet} {
    font-size: 32px;
  }
  ${screen.desktop} {
    font-size: 40px;
  }
  ${screen.xwide} {
    font-size: 48px;
  }
  margin-top: 0;
  margin-bottom: 8px;
`

const ActionButtons = styled.div`
  ${Flex.Container.style()
    .alignItems('center')
    .justifyContent('flex-end')
    .create()};
  gap: 8px;
  margin-bottom: 48px;
`

const Body = styled.p`
  ${Font.style()
    .size('16px')
    .weight(500)
    .color(colors.grey4)
    .lineHeight(1.5)
    .letterSpacing('-0.5px')
    .create()};
  ${screen.tablet} {
    font-size: 22px;
  }
  ${screen.desktop} {
    font-size: 24px;
  }
  ${screen.xwide} {
    font-size: 26px;
  }
  margin-top: 0;
  margin-bottom: 40px;
  white-space: pre-wrap;
  word-break: keep-all;
`

const BottomActionBlock = styled.div`
  ${Flex.Container.style().direction('column').alignItems('center').create()};
  gap: 4px;
  margin-bottom: 40px;
`

const UserInfo = styled.div`
  ${Flex.Container.style().justifyContent('end').create()};
  ${Font.style()
    .size('13px')
    .weight(400)
    .color(colors.grey4)
    .lineHeight(1.33)
    .create()};
  gap: 4px;
  & b {
    font-weight: 700;
  }
`

const LikesCount = styled(motion.div)`
  ${Flex.Container.style().create()};
  ${Font.style()
    .size('12px')
    .weight(600)
    .color(colors.grey3)
    .lineHeight(1.5)
    .create()};
  ${screen.tablet} {
    font-size: 16px;
  }
  ${screen.desktop} {
    font-size: 20px;
  }
`

const Footer = styled.div`
  ${Flex.Container.style().direction('column').create()};
`
