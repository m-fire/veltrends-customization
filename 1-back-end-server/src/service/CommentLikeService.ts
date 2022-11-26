import db from '../common/config/prisma/db-client.js'
import { CommentParams } from './CommentService.js'

class CommentLikeService {
  private static instance: CommentLikeService

  static getInstance() {
    if (!CommentLikeService.instance) {
      CommentLikeService.instance = new CommentLikeService()
    }
    return CommentLikeService.instance
  }

  private constructor() {}

  async like({ commentId, userId }: LikeParams) {
    try {
      await db.commentLike.create({
        data: { commentId, userId },
      })
    } catch (e) {
      console.log(`CommentLikeService.like() catch error`, { e })
    }
    const likeCount = await this.countCommentLike(commentId)
    return likeCount
  }

  async unlike({ commentId, userId }: UnlikeParams) {
    try {
      await db.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      })
    } catch (e) {}
    const likeCount = await this.countCommentLike(commentId)
    return likeCount
  }

  async getCommentLikeList({ userId, commentIds }: GetCommentLikeListParams) {
    return await db.commentLike.findMany({
      where: {
        userId,
        commentId: { in: commentIds },
      },
      include: { comment: { select: { id: true } } },
    })
  }

  async getCommentLikeOrNull({ commentId, userId }: GetCommentLikeOrNull) {
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

  private async countCommentLike(commentId: number) {
    const likeCount = await db.commentLike.count({ where: { commentId } })
    return likeCount
  }
}
export default CommentLikeService

// types

type LikeParams = CommentParams

type UnlikeParams = LikeParams

type GetCommentLikeListParams = { userId: number; commentIds: number[] }

type GetCommentLikeOrNull = {
  commentId: number
  userId: number | null
}
