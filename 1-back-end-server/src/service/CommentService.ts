import { Comment } from '@prisma/client'
import AppError from '../common/error/AppError.js'
import CommentLikeService from './CommentLikeService.js'
import ItemStatusService from './ItemStatusService.js'
import CommentRepository from '../repository/CommentRepository.js'
import { TypeMapper } from '../common/util/type-mapper.js'

class CommentService {
  static async createComment({
    itemId,
    userId,
    text,
    parentCommentId,
  }: CreateCommentParams) {
    CS.validateTextLength(text)

    const parentOrNull = await CS.getCommentIncludeSubList({
      commentId: parentCommentId,
      userId,
      withSubcomments: false,
    })
    const parentId = parentOrNull?.parentCommentId ?? parentCommentId
    const isSubcomment = parentOrNull != null && parentId != null
    const mentionUserId = parentOrNull?.userId

    // 하위댓글 이며, 부모 ID를 갖으며, 언급대상자가 현사용자가 아닌 경우:
    // -> 특정 사용자를 언급한 상태
    const shouldMentionUser =
      isSubcomment && parentId != null && mentionUserId !== userId

    const newComment = await CR.createComment({
      itemId,
      text,
      userId,
      parentCommentId: isSubcomment ? parentId : undefined,
      mentionUserId: shouldMentionUser ? mentionUserId : undefined,
    })

    // 하위댓글 인 경우, subcommentCount 증가 후, 댓글 수 동기화
    if (isSubcomment) {
      const subcommentCount = await CR.countCommentBy({
        where: { parentCommentId: parentId },
      })
      await CR.updateComment(parentId, { userId, subcommentCount })
    }

    await CS.syncCommentCount(itemId)

    const serializedComment = CS.serialize({
      comment: newComment,
      isLiked: false,
      isDeleted: false,
    })
    return {
      ...serializedComment,
      // subcommentList: isSubcomment ? undefined : [],
    }
  }

  static async getAllCommentList({ itemId, userId }: GetCommentListParams) {
    const commentList = await CR.findCommentListBy(
      {
        itemId,
      },
      {
        orderBy: { id: 'asc' },
        // take: limit,
      },
    )

    // 유효댓글 ID목록으로 {K: commentId, V:commentLikeList} 맵 가져오기
    const commentLikeMap = await CLS.getCommentLikeByIdMap({
      commentIds: commentList.map((c) => c.id),
      userId,
    })

    const commentsWithDisabled = commentList.map((c) => {
      const isDeleted = c.deletedAt != null
      // 삭제된 댓글 비활성화 처리
      const comment = isDeleted
        ? CS.disableComment(c, {
            user: { id: 0, username: '' },
            mentionUser: null,
          })
        : c
      return CS.serialize({
        comment,
        isLiked: commentLikeMap[comment.id] != null,
        isDeleted,
      })
    })

    const subcommentsMap = {} as { [k: number]: typeof commentsWithDisabled }
    commentsWithDisabled.forEach((c) => {
      if (!c.parentCommentId) return

      const sublist = subcommentsMap[c.parentCommentId] ?? []
      sublist.push(c)
      subcommentsMap[c.parentCommentId] = sublist
    })

    /* compose rootComment, subcomments */
    const composedCommentList = commentsWithDisabled
      // subcomment 는 부모 comment 에 포함되기 때문에 전체 댓글목록에서 제외됨.
      .filter((c) => c.parentCommentId != null)
      .map((c) => {
        const subcommentList = subcommentsMap[c.id] ?? []
        return { ...c, subcommentList }
      })

    return composedCommentList
  }

  private static disableComment<C extends Comment>(
    comment: C,
    disableProps?: Omit<C, keyof Comment>,
  ): C {
    return {
      ...comment,
      text: '',
      likeCount: 0,
      subcommentCount: 0,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      user: {},
      mentionUser: null,
      ...disableProps,
    }
  }

  static async getSubcommentList({
    parentCommentId,
    userId,
  }: GetSubcommentListParams) {
    const subcommentList = await CR.findSubcommentListBy(
      {
        parentCommentId,
      },
      {
        // limit: LIMIT_COMMENTS // Todo: 향후 댓글 페이징이 필요할때에 제한
      },
    )

    // 유효댓글 ID목록으로 {K: commentId, V:commentLikeList} 맵 가져오기
    const commentLikeMap = await CLS.getCommentLikeByIdMap({
      commentIds: subcommentList.map((sc) => sc.id),
      userId,
    })

    const serializedList = subcommentList.map((sc) =>
      CS.serialize({
        comment: sc,
        isLiked: commentLikeMap[sc.id] != null,
        isDeleted: sc.deletedAt != null,
      }),
    )
    return serializedList
  }

  static async getCommentIncludeSubList({
    commentId,
    userId,
    withSubcomments = false,
  }: GetCommentOrNullParams) {
    if (!commentId) return null

    const comment = await CR.findCommentOrNull(commentId, {
      include: CR.Query.includeUserAndMentionUser(),
    })
    if (!comment) return null

    const commentLikeOrNull =
      userId != null
        ? await CLS.getCommentLikeOrNull({ commentId, userId })
        : null
    const serializedComment = CS.serialize({
      comment,
      isLiked: commentLikeOrNull != null,
      isDeleted: comment!.deletedAt != null,
    })

    if (!withSubcomments) return { ...serializedComment, subcommentList: [] }

    const subcommentList = await CS.getSubcommentList({
      parentCommentId: commentId,
      userId,
    })

    return { ...serializedComment, subcommentList }
  }

  static async editComment({ commentId, userId, text }: UpdateCommentParams) {
    await CR.updateComment(commentId, { userId, text })
    return CS.getCommentIncludeSubList({
      commentId: commentId,
      withSubcomments: true,
      userId,
    })
  }

  static async deleteComment({ commentId, userId }: DeleteCommentParams) {
    const deletedComment = await CR.deleteComment({ commentId, userId })
    await CS.syncCommentCount(deletedComment.itemId)
  }

  static async likeComment({ commentId, userId }: LikeCommentParams) {
    const likeCount = await CLS.like({ commentId, userId })
    await CS.syncLikeCount({ commentId, likeCount })
    return likeCount
  }

  static async unlikeComment({ commentId, userId }: UnlikeCommentParams) {
    const likeCount = await CLS.unlike({
      commentId,
      userId,
    })
    await CS.syncLikeCount({ commentId, likeCount })
    return likeCount
  }

  // utils

  private static serialize<C extends Comment>({
    comment,
    isLiked,
    isDeleted,
  }: SerializeCommentParams<C>) {
    const mappedComment = TypeMapper.mapProps(
      comment,
      Date,
      (d) => d.toISOString(),
      true,
    )
    return {
      ...mappedComment,
      isLiked,
      isDeleted,
    }
  }

  private static async syncLikeCount({
    commentId,
    likeCount,
  }: SyncLikeCountParams) {
    await CR.updateComment(commentId, { likeCount })
  }

  private static async syncCommentCount(itemId: number) {
    const commentCount = await CR.countCommentBy({ where: { itemId } })
    await ItemStatusService.updateCommentCount({
      itemId,
      commentCount,
    })
  }

  private static validateTextLength(text: string) {
    const textLength = text.length
    if (textLength === 0 || textLength > 300) {
      throw new AppError('BadRequest', { message: 'text length is invalid' })
    }
  }
}
export default CommentService

const CS = CommentService
const CR = CommentRepository
const CLS = CommentLikeService

// types

type CreateCommentParams = {
  itemId: number
  userId: number
  text: string
  parentCommentId?: number
}

type GetCommentListParams = {
  itemId: number
  userId: number | null
}

type GetCommentOrNullParams = {
  commentId?: number
  userId: number | null
  withSubcomments: boolean
}

type GetSubcommentListParams = {
  parentCommentId: number
  userId: number | null
}

export type DeleteCommentParams = {
  commentId: number
  userId: number
}

type UpdateCommentParams = DeleteCommentParams & {
  text: string
}

type SyncLikeCountParams = {
  commentId: number
  likeCount: number
}

export type LikeCommentParams = {
  commentId: number
  userId: number
}

export type UnlikeCommentParams = LikeCommentParams

type SerializeCommentParams<C extends Comment> = {
  comment: C
  isLiked: boolean
  isDeleted: boolean
}
