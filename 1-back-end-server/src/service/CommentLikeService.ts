import db from '../common/config/prisma/db-client.js'
import { DeleteCommentParams } from './CommentService.js'

class CommentLikeService {
  private static async countCommentLike(commentId: number) {
    return await db.commentLike.count({ where: { commentId } })
  }

  static async like({ commentId, userId }: LikeParams) {
    try {
      await db.commentLike.create({
        data: { commentId, userId },
      })
    } catch (e) {
      console.log(`CommentLikeService.like() catch error`, { e })
    }
    return CLS.countCommentLike(commentId)
  }

  static async unlike({ commentId, userId }: UnlikeParams) {
    try {
      await db.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      })
    } catch (e) {
      console.log(`CommentLikeService.like() catch error`, { e })
    }
    return CLS.countCommentLike(commentId)
  }

  static async getCommentLikeList({
    userId,
    commentIds,
  }: GetCommentLikeListParams) {
    return await db.commentLike.findMany({
      where: {
        userId,
        commentId: { in: commentIds },
      },
      include: { comment: { select: { id: true } } },
    })
  }

  static async getCommentLikeOrNull({
    commentId,
    userId,
  }: GetCommentLikeOrNull) {
    return await db.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })
  }

  static async getCommentLikeMapByCommentIds({
    commentIds,
    userId,
  }: GetCommentLikeMapParams) {
    if (userId == null) return {}

    const commentLikeList = await CLS.getCommentLikeList({
      userId,
      commentIds,
    })

    const commentLikeMap = commentLikeList.reduce((acc, commentLike) => {
      acc[commentLike.commentId] = commentLike
      return acc
    }, {} as Record<number, typeof commentLikeList[0]>)

    return commentLikeMap
  }
}
export default CommentLikeService

const CLS = CommentLikeService

// types

type LikeParams = DeleteCommentParams

type UnlikeParams = LikeParams

type GetCommentLikeListParams = { userId: number; commentIds: number[] }

type GetCommentLikeMapParams = {
  commentIds: number[]
  userId?: number | null
}

type GetCommentLikeOrNull = {
  commentId: number
  userId: number
}
