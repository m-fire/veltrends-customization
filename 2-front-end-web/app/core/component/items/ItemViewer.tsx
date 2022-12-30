import React from 'react'
import { Item } from '~/core/api/types'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { AnimatePresence, motion } from 'framer-motion'
import LikeButton from '~/core/component/items/LikeButton'
import { useDateDistance } from '~/common/hook/useDateDistance'
import { useOpenDialog } from '~/common/hook/useOpenDialog'
import { useAuthUser } from '~/common/context/UserContext'
import Earth from '~/core/component/generate/svg/Earth'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { useItemInteractionStateById } from '~/core/hook/store/useItemInteractionStore'
import { useItemInteractions } from '~/core/hook/useItemInteractions'

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

  const itemInteractionState = useItemInteractionStateById(itemId)
  const { likeItem, unlikeItem } = useItemInteractions()

  // Dialog settings
  const itemStatus = itemInteractionState?.itemStatus ?? item.itemStatus
  const openDialog = useOpenDialog()
  const authUser = useAuthUser()
  const toggleLike = async () => {
    if (authUser == null) {
      openDialog('LIKE_ITEM', { gotoLogin: true })
      return
    }
    if (isLiked) {
      await unlikeItem(itemId, itemStatus)
    } else {
      await likeItem(itemId, itemStatus)
    }
  }

  const pastDistance = useDateDistance(createdAt)
  const isLiked = itemInteractionState?.isLiked ?? item.isLiked
  const likeCount =
    itemInteractionState?.itemStatus.likeCount ?? itemStatus.likeCount

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
          {/*<OriginLink href={link}>*/}
          {/*  이동*/}
          {/*  <Shortcut />*/}
          {/*</OriginLink>*/}

          <Body>{body}</Body>
        </a>

        <Footer>
          <LikeBlock>
            <LikeButton
              size="large"
              isLiked={isLiked}
              disabled={authUser == null}
              onClick={toggleLike}
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
          </LikeBlock>

          <UserInfo>
            by <b>{user.username}</b> · <span>{pastDistance}</span>
          </UserInfo>
        </Footer>
      </Content>
    </Block>
  )
}
export default ItemViewer

// Inner Components

const Block = styled.div`
  ${flexStyles({ direction: 'column' })};
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
  ${flexStyles({ alignItems: 'center' })};
  ${fontStyles({
    size: '12px',
    weight: 400,
    color: colors.grey2,
    lineHeight: 1.33,
  })};
  margin: 0;
  gap: 4px;
  img,
  svg {
    display: inline-block;
    width: 20px;
    height: 20px;
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

const Title = styled.h2`
  ${fontStyles({
    size: '20px',
    weight: 800,
    color: colors.grey5,
    letterSpacing: '-0.5px',
  })};
  line-height: 1.5;
  margin: 0 0 56px;
`

// const OriginLink = styled.a`
//   ${flexStyles({
//     alignItems: 'flex-end',
//     justifyContent: 'flex-end',
//   })};
//   ${fontStyles({
//     size: '18px',
//     weight: 600,
//     color: colors.primary1,
//     lineHeight: 1,
//   })};
//   text-decoration: none;
//   margin: 0 0 30px;
//   gap: 6px;
//   & > svg {
//     display: inline-block;
//     width: 20px;
//     height: 20px;
//   }
// `

const Body = styled.p`
  ${fontStyles({
    size: '16px',
    weight: 500,
    color: colors.grey4,
    lineHeight: 1.5,
    letterSpacing: '-0.5px',
  })};
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 40px;
  white-space: pre-wrap;
  word-break: keep-all;
`

const LikeBlock = styled.div`
  ${flexStyles({ direction: 'column', alignItems: 'center' })};
  gap: 4px;
  margin-bottom: 40px;
  & svg {
    color: ${colors.grey2};
  }
`

const UserInfo = styled.div`
  ${flexStyles({ justifyContent: 'end' })};
  ${fontStyles({
    size: '14px',
    weight: 400,
    color: colors.grey4,
    lineHeight: 1.33,
  })};
  gap: 4px;
  & b {
    font-weight: 700;
  }
`

const LikesCount = styled(motion.div)`
  ${flexStyles()};
  ${fontStyles({
    size: '12px',
    weight: 600,
    color: colors.grey4,
    lineHeight: 1.5,
  })};
`

const Footer = styled.div`
  ${flexStyles({ direction: 'column' })};
`
