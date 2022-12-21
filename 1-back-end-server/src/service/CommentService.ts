import db from '../common/config/prisma/db-client.js'
import { Comment } from '@prisma/client'
import AppError from '../common/error/AppError.js'
import CommentLikeService from './CommentLikeService.js'
import ItemStatusService from './ItemStatusService.js'

// prisma include conditions
const INCLUDE_SIMPLE_USER = { select: { id: true, username: true } } as const

class CommentService {
  static async createComment({
    itemId,
    userId,
    text,
    parentCommentId = null,
  }: CreateCommentParams) {
    CommentService.validateTextLength(text)

    const parentComment = await CommentService.getCommentOrNull({
      commentId: parentCommentId,
      userId,
    })
    const rootId = parentComment?.parentCommentId
    const parentId = rootId ?? parentCommentId
    const isSubcomment = parentComment != null && parentId != null
    const mentionUserId = parentComment?.userId

    // 최상위 댓글이 아니고, 부모 ID를 갖으며, 남에게 댓글단 경우: 사용자언급 허용!
    const shouldMention =
      isSubcomment && rootId != null && mentionUserId !== userId

    const newComment = await db.comment.create({
      data: {
        itemId,
        text,
        userId,
        parentCommentId: isSubcomment ? parentId : null,
        mentionUserId: shouldMention ? mentionUserId : null,
      },
      include: { user: INCLUDE_SIMPLE_USER },
    })

    // 하위댓글 인 경우, subcommentCount 증가 후, 댓글 수 동기화
    if (isSubcomment) {
      const subcommentCount = await db.comment.count({
        where: { parentCommentId: parentId },
      })
      await db.comment.update({
        where: { id: parentId },
        data: { subcommentCount },
      })
    }

    await CommentService.syncCommentCount(itemId)
    return {
      ...newComment,
      subcommentList: [],
      isDeleted: false,
      isLiked: false,
    }
  }

  static async getCommentList({ itemId, userId }: GetCommentListParams) {
    const commentList = await db.comment.findMany({
      where: { itemId },
      orderBy: { id: 'asc' },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })

    // 댓글들의 ID 목록으로, commentId 당 commentLike 맵을 만들어,
    const commentIds = commentList.map((c) => c.id)
    const commentLikedMap = await CommentService.getCommentLikeMapOrEmpty({
      commentIds,
      userId,
    })
    // commentLike 된 댓글들 마다 isLiked 설정
    const commentListWithIsLiked = commentList.map((c) => ({
      ...c,
      isLiked: !!commentLikedMap[c.id],
    }))
    // deleted comment 노멀라이징
    const normalizedList = CommentService.normalizeDeletedCommentInList(
      commentListWithIsLiked,
    )

    // 최종적으로 가공된 댓글목록 내보내기
    return await CommentService.composeSubcommentList(normalizedList)
  }

  private static normalizeDeletedCommentInList(comments: Comment[]): Comment[] {
    return comments.map((c) => {
      if (!c.deletedAt)
        return {
          ...c,
          isDeleted: false,
        }

      const someDate = new Date(0)
      return {
        ...c,
        text: '',
        likeCount: 0,
        subcommentCount: 0,
        createdAt: someDate,
        updatedAt: someDate,
        user: {
          id: -1,
          username: 'deleted',
        },
        mentionUser: null,
        subcommentList: [],
        isDeleted: true,
      }
    })
  }

  private static async composeSubcommentList(comments: Comment[]) {
    const rootComments = comments.filter((c) => c.parentCommentId == null)
    const commentsByParentIdMap = new Map<number, Comment[]>()

    comments.forEach((c) => {
      if (!c.parentCommentId) return
      if (c.deletedAt != null) return
      const subComments = commentsByParentIdMap.get(c.parentCommentId) ?? []
      subComments.push(c)
      commentsByParentIdMap.set(c.parentCommentId, subComments)
    })

    return rootComments
      .map((c) => ({
        ...c,
        subcommentList: commentsByParentIdMap.get(c.id) ?? [],
      }))
      .filter((c) => {
        return c.deletedAt == null || c.subcommentList.length > 0
      })
  }

  static async getCommentOrNull({
    commentId,
    withSubcomments = false,
    userId,
  }: GetCommentParams) {
    if (commentId == null) return null

    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })

    // 댓글이 없거나, 지워진 댓글이면 찾을수없음
    if (!comment || comment.deletedAt) throw new AppError('NotFound')
    // 하위댓글목록이 필요없다면 없다면 단일댓글 반환
    if (!withSubcomments) return comment

    const subcommentList = await CommentService.getSubcommentList({
      parentCommentId: commentId,
      userId,
    })
    const commentLike = await CommentLikeService.getCommentLikeOrNull({
      commentId,
      userId,
    })

    return {
      ...comment,
      isLiked: commentLike != null,
      isDeleted: false,
      subcommentList,
    }
  }

  static async getSubcommentList({
    parentCommentId,
    userId,
  }: GetSubcommentListParams) {
    const subcommentList = await db.comment.findMany({
      where: {
        parentCommentId,
        deletedAt: null,
      },
      orderBy: { id: 'asc' },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })

    const commentLikedMapOrEmpty =
      await CommentService.getCommentLikeMapOrEmpty({
        userId,
        commentIds: subcommentList.map((sc) => sc.id),
      })

    return subcommentList.map((subcomment) => ({
      ...subcomment,
      isLiked: commentLikedMapOrEmpty[subcomment.id] != null,
      isDeleted: false,
    }))
  }

  static async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    const comment = await db.comment.findFirst({ where: { id: commentId } })
    if (comment != null && comment.userId !== userId) new AppError('Forbidden')

    await db.comment.update({
      where: { id: commentId },
      data: { text },
      include: { user: INCLUDE_SIMPLE_USER },
    })
    return CommentService.getCommentOrNull({
      commentId,
      withSubcomments: true,
      userId: null,
    })
  }

  static async deleteComment({ commentId, userId }: DeleteCommentParams) {
    const comment = await db.comment.findFirst({ where: { id: commentId } })
    if (comment?.userId !== userId) new AppError('Forbidden')

    await db.comment.delete({ where: { id: commentId } })
    await CommentService.syncCommentCount(comment!.itemId)
  }

  static async likeComment({ commentId, userId }: LikeCommentParams) {
    const likeCount = await CommentLikeService.like({ commentId, userId })
    await CommentService.syncLikeCount({ commentId, likeCount })
    return likeCount
  }

  static async unlikeComment({ commentId, userId }: UnlikeCommentParams) {
    const likeCount = await CommentLikeService.unlike({
      commentId,
      userId,
    })
    await CommentService.syncLikeCount({ commentId, likeCount })
    return likeCount
  }

  private static async syncLikeCount({
    commentId,
    likeCount,
  }: UpdateLikeCountParams) {
    await db.comment.update({
      data: { likeCount },
      where: { id: commentId },
    })
  }

  private static async syncCommentCount(itemId: number) {
    const commentCount = await db.comment.count({
      where: { itemId },
    })
    await ItemStatusService.updateCommentCount({
      itemId,
      commentCount,
    })
  }

  private static validateTextLength(text: string) {
    const textLength = text.length
    if (textLength === 0 || textLength > 300) {
      throw new AppError('BadRequest', { message: 'text is invalid' })
    }
  }

  private static async getCommentLikeMapOrEmpty({
    commentIds,
    userId,
  }: GetCommentLikeMapParams) {
    if (userId == null) return {}

    const commentLikeList = await CommentLikeService.getCommentLikeList({
      userId,
      commentIds,
    })

    type CommentLikeElement = typeof commentLikeList[0]
    const commentLikeByIdMap = commentLikeList.reduce((acc, commentLike) => {
      acc[commentLike.commentId] = commentLike
      return acc
    }, {} as Record<number, CommentLikeElement>)

    return commentLikeByIdMap
  }
}
export default CommentService

// types

type CreateCommentParams = {
  itemId: number
  userId: number
  text: string
  parentCommentId: number | null
}

type GetCommentListParams = {
  itemId: number
  userId: number | null
}

type GetCommentParams = {
  commentId: number | null
  withSubcomments?: boolean
  userId: number | null
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

type UpdateLikeCountParams = { commentId: number; likeCount: number }

export type LikeCommentParams = {
  commentId: number
  userId: number
}

export type UnlikeCommentParams = LikeCommentParams

type GetCommentLikeMapParams = {
  userId: number | null
  commentIds: number[]
}
