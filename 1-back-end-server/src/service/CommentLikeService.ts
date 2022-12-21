import db from '../common/config/prisma/db-client.js'
import { DeleteCommentParams } from './CommentService.js'

class CommentLikeService {
  static async like({ commentId, userId }: LikeParams) {
    try {
      await db.commentLike.create({
        data: { commentId, userId },
      })
    } catch (e) {
      console.log(`CommentLikeService.like() catch error`, { e })
    }
    return CommentLikeService.countCommentLike(commentId)
  }

  static async unlike({ commentId, userId }: UnlikeParams) {
    try {
      await db.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      })
    } catch (e) {}
    return CommentLikeService.countCommentLike(commentId)
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
    if (userId == null) return null

    return await db.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })
  }

  private static async countCommentLike(commentId: number) {
    return await db.commentLike.count({ where: { commentId } })
  }
}
export default CommentLikeService

// types

type LikeParams = DeleteCommentParams

type UnlikeParams = LikeParams

type GetCommentLikeListParams = { userId: number; commentIds: number[] }

type GetCommentLikeOrNull = {
  commentId: number
  userId: number | null
}
