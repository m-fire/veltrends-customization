import { Comment } from '@prisma/client'
import AppError from '../common/error/AppError.js'
import CommentLikeService from './CommentLikeService.js'
import ItemStatusService from './ItemStatusService.js'
import CommentRepository from '../repository/CommentRepository.js'

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
        parentCommentId: parentId,
      })
      await CR.updateComment(parentId, { userId, subcommentCount })
    }

    await CS.syncCommentCount(itemId)

    return CS.serializeComment({
      comment: newComment,
      isLiked: false,
      isDeleted: false,
      subcommentList: isSubcomment ? undefined : [],
    })
  }

  static async getAllCommentList({ itemId, userId }: GetCommentListParams) {
    const commentList = await CR.findCommentListBy(
      {
        itemId,
        // limit,
      },
      { id: 'asc' },
    )

    // 유효댓글 ID목록으로 {K: commentId, V:commentLikeList} 맵 가져오기
    const likesByIdMap = await CLS.getCommentLikeMapByCommentIds({
      commentIds: commentList.map((c) => c.id),
      userId,
    })

    const serializedList = commentList.map((c) => {
      const isDeleted = c.deletedAt != null
      const comment = isDeleted
        ? // 삭제된 댓글 비활성화 처리
          CS.desableCommentProps(c, {
            user: { id: 0, username: '' },
            mentionUser: null,
          })
        : c
      return CS.serializeComment({
        comment,
        isLiked: likesByIdMap[comment.id] != null,
        isDeleted,
      })
    })

    const subcommentsMap = CS.generateSubcommentsMap(serializedList)

    const filteredAllComments = serializedList
      .map((c) => {
        const isSubComment = c.parentCommentId != null
        if (isSubComment) return null

        const sublist = subcommentsMap[c.id]
        return {
          ...c,
          subcommentList: sublist != null ? sublist : [],
        }
      })
      .filter((c) => c != null)

    return filteredAllComments
  }

  private static desableCommentProps<C extends Comment>(
    comment: C,
    includedProps?: Omit<C, keyof Comment>,
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
      ...includedProps,
    }
  }

  static async getSubcommentList({
    parentCommentId,
    userId,
  }: GetSubcommentListParams) {
    const subcommentList = await CR.findSubcommentListBy({
      parentCommentId,
      // limit: LIMIT_COMMENTS // Todo: 댓글 페이징이 필요할때에 제한
    })

    const commentLikeMap = await CLS.getCommentLikeMapByCommentIds({
      commentIds: subcommentList.map((sc) => sc.id),
      userId,
    })

    const serializedList = subcommentList.map((subcomment) =>
      CS.serializeComment({
        comment: subcomment,
        isLiked: commentLikeMap[subcomment.id] != null,
        isDeleted: subcomment.deletedAt != null,
      }),
    )
    return serializedList
  }

  static async getCommentIncludeSubList({
    commentId,
    userId,
    withSubcomments = false,
  }: GetCommentOrNullParams) {
    if (commentId == null) return null

    const comment = await CR.findCommentOrThrow(commentId)
    if (withSubcomments === false) return comment

    const commentLikeOrNull =
      userId == null
        ? null
        : await CLS.getCommentLikeOrNull({ commentId, userId })

    const subcommentList = await CS.getSubcommentList({
      parentCommentId: commentId,
      userId,
    })

    return CS.serializeComment({
      comment,
      isLiked: commentLikeOrNull != null,
      isDeleted: comment!.deletedAt != null,
      subcommentList,
    })
  }

  static async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    await CR.findCommentOrThrow(commentId)
    await CR.updateComment(commentId, { userId, text })
    return CS.getCommentIncludeSubList({
      commentId: commentId,
      withSubcomments: true,
      userId: undefined,
    })
  }

  static async deleteComment({ commentId, userId }: DeleteCommentParams) {
    const comment = await CR.findCommentOrThrow(commentId)
    if (comment) {
      await CR.deleteComment({ commentId, userId })
      await CS.syncCommentCount(comment.itemId)
    }
  }

  static async likeComment({ commentId, userId }: LikeCommentParams) {
    const likeCount = await CLS.like({ commentId, userId })
    await CS.syncLikeCount({ commentId, userId, likeCount })
    return likeCount
  }

  static async unlikeComment({ commentId, userId }: UnlikeCommentParams) {
    const likeCount = await CLS.unlike({
      commentId,
      userId,
    })
    await CS.syncLikeCount({ commentId, userId, likeCount })
    return likeCount
  }

  // utils

  private static serializeComment<C, SC>({
    comment,
    isLiked,
    isDeleted,
    subcommentList,
  }: SerializeCommentParams<C, SC>) {
    return {
      ...comment,
      isLiked,
      isDeleted,
      subcommentList,
    }
  }

  private static async syncLikeCount({
    commentId,
    userId,
    likeCount,
  }: UpdateLikeCountParams) {
    await CR.updateComment(commentId, { userId, likeCount })
  }

  private static async syncCommentCount(itemId: number) {
    const commentCount = await CR.countCommentBy({ itemId })
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

  private static generateSubcommentsMap<
    C extends { id: number; parentCommentId: number | null },
  >(comments: C[]) {
    const sublistByIdMap = {} as { [k: number]: C[] }

    comments.forEach((c) => {
      const { parentCommentId: parentId } = c
      if (parentId == null) return

      const sublist = sublistByIdMap[parentId] ?? []
      sublist.push(c)
      sublistByIdMap[parentId] = sublist
    })

    return sublistByIdMap
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
  userId?: number
  withSubcomments?: boolean
}

type GetSubcommentListParams = {
  parentCommentId: number
  userId?: number
}

export type DeleteCommentParams = {
  commentId: number
  userId: number
}

type UpdateCommentParams = DeleteCommentParams & {
  text: string
}

type UpdateLikeCountParams = {
  commentId: number
  userId: number
  likeCount: number
}

export type LikeCommentParams = {
  commentId: number
  userId: number
}

export type UnlikeCommentParams = LikeCommentParams

type SerializeCommentParams<C, SC> = {
  comment: C
  isLiked: boolean
  isDeleted: boolean
  subcommentList?: SC
}
