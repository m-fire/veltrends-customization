import React from 'react'
import { Item } from '~/common/api/types'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { AnimatePresence, motion } from 'framer-motion'
import LikeButton from '~/components/system/LikeButton'
import { displayFlex, fontStyles } from '~/components/home/LinkCard'
import { useItemOverrideById } from '~/context/ItemStatusContext'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import { useItemLikeActions } from '~/common/hooks/useItemStatusActions'
import { useOpenDialog } from '~/common/hooks/useOpenDialog'
import { useAuthUser } from '~/context/UserContext'
import Earth from '~/components/generate/svg/Earth'
import Shortcut from '~/components/generate/svg/Shortcut'
import { Link } from '@remix-run/react'

type ItemViewerProps = {
  item: Item
}

function ItemViewer({ item }: ItemViewerProps) {
  const {
    id,
    thumbnail,
    publisher,
    author,
    title,
    body,
    user,
    createdAt,
    link,
  } = item
  const itemOverride = useItemOverrideById(id)
  const pastDistance = useDateDistance(createdAt)

  const itemStatus = itemOverride?.itemStatus ?? item.itemStatus
  const isLiked = itemOverride?.isLiked ?? item.isLiked
  const likes = itemOverride?.itemStatus.likes ?? itemStatus.likes

  const { like, unlike } = useItemLikeActions()
  const openDialog = useOpenDialog()
  const authUser = useAuthUser()

  const toggleLike = async () => {
    if (!authUser) {
      openDialog('LIKE_ITEM-LOGIN')
      return
    }
    if (isLiked) {
      await unlike(id, itemStatus)
    } else {
      await like(id, itemStatus)
    }
  }

  return (
    <Block>
      {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}

      <Content>
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
        <Title>{title}</Title>
        <OriginLink to={link}>
          원문 바로가기
          <Shortcut />
        </OriginLink>

        <Body>{body}</Body>

        <Footer>
          <UserInfo>
            by <b>{user.username}</b> · <span>{pastDistance}</span>
          </UserInfo>

          <LikeBlock>
            <StyledLikeButton isLiked={isLiked} onClick={toggleLike} />
            <AnimatePresence initial={false}>
              {likes === 0 ? null : (
                <LikesCount
                  key="likes"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: -26, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  좋아요 {likes.toLocaleString()}
                </LikesCount>
              )}
            </AnimatePresence>
          </LikeBlock>
        </Footer>
      </Content>
    </Block>
  )
}
export default ItemViewer

// Inner Components

const Block = styled.div`
  ${displayFlex({ direction: 'column' })}
`

const Thumbnail = styled.img`
  // Card 뷰에서와 다르게, 가로폭을 가득 체우고 세로길이를 고정하기 위한 설정
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
`

const Content = styled.div`
  padding: 30px;
  border-bottom: 4px solid ${colors.grey1};
`

const Publisher = styled.div<{ hasThumbnail: boolean }>`
  ${displayFlex({ alignItems: 'center' })}
  ${fontStyles({
    size: '12px',
    weight: 400,
    color: colors.grey2,
    lineHeight: 1.33,
  })}
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
    })}
  }
`

const Title = styled.h2`
  ${fontStyles({
    size: '20px',
    weight: 800,
    color: colors.grey5,
    letterSpacing: '-0.5px',
  })}
  margin: 0;
  line-height: 1.5;
`

const OriginLink = styled(Link)`
  ${displayFlex({
    justifyContent: 'flex-start',
    alignItems: 'center',
  })}
  ${fontStyles({
    size: '12px',
    weight: 800,
    color: colors.grey3,
  })};
  text-decoration: none;
  gap: 4px;
  margin: 0 0 30px;
  & > svg {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: ${colors.grey6};
  }
`

const Body = styled.p`
  ${fontStyles({
    size: '16px',
    weight: 500,
    color: colors.grey4,
    lineHeight: 1.5,
    letterSpacing: '-0.5px',
  })}
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 24px;
  white-space: pre-wrap;
  word-break: keep-all;
`

const UserInfo = styled.div`
  ${displayFlex({ justifyContent: 'end' })}
  ${fontStyles({
    size: '14px',
    weight: 400,
    color: colors.grey4,
    lineHeight: 1.33,
  })}
  gap: 4px;
  margin-bottom: 40px;
  & b {
    font-weight: 700;
  }
`

const LikeBlock = styled.div`
  ${displayFlex({ direction: 'column', alignItems: 'center' })}
  gap: 4px;
`

const StyledLikeButton = styled(LikeButton)`
  width: 24px;
  height: 24px;
`

const LikesCount = styled(motion.div)`
  ${displayFlex()};
  font-size: 12px;
  font-weight: 600;
  color: ${colors.grey4};
  line-height: 1.5;
`

const Footer = styled.div`
  ${displayFlex({ direction: 'column' })}
`
