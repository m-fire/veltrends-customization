import React from 'react'
import { Item } from '~/common/api/types'
import styled from 'styled-components'
import { colors } from '~/common/style/colors'
import { AnimatePresence, motion } from 'framer-motion'
import LikeButton from '~/components/system/LikeButton'
import { displayFlex, fontStyles } from '~/components/home/LinkCard'
import { useItemOverrideById } from '~/common/context/ItemStatusContext'
import { useDateDistance } from '~/common/hooks/useDateDistance'
import { useItemLikeActions } from '~/common/hooks/useItemStatusActions'
import { useOpenDialog } from '~/common/hooks/useOpenDialog'
import { useAuthUser } from '~/common/context/UserContext'
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
  const likeCount = itemOverride?.itemStatus.likeCount ?? itemStatus.likeCount

  const { like, unlike } = useItemLikeActions()
  const openDialog = useOpenDialog({ gotoLogin: true })
  const authUser = useAuthUser()

  const toggleLike = async () => {
    if (!authUser) {
      openDialog('LIKE_ITEM>>LOGIN')
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
          이동
          <Shortcut />
        </OriginLink>

        <Body>{body}</Body>

        <Footer>
          <UserInfo>
            by <b>{user.username}</b> · <span>{pastDistance}</span>
          </UserInfo>

          <LikeBlock>
            <StyledLikeButton
              size="large"
              isLiked={isLiked}
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
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  })}
  ${fontStyles({
    size: '18px',
    weight: 600,
    color: colors.primary1,
    lineHeight: 1,
  })};
  text-decoration: none;
  margin: 0 0 30px;
  gap: 6px;
  & > svg {
    display: inline-block;
    width: 20px;
    height: 20px;
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
  & svg {
    color: ${colors.grey2};
  }
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
