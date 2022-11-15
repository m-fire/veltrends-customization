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

  async like({ userId, commentId }: CommentParams) {
    const like = db.commentLike.create({
      data: { userId, commentId },
    })

    const likeCount = await this.countLike(commentId)
    return likeCount
  }

  async unlike({ userId, commentId }: CommentParams) {
    try {
      await db.commentLike.delete({
        where: { commentId_userId: { userId, commentId } },
      })
    } catch (e) {}

    const likeCount = await this.countLike(commentId)
    return likeCount
  }

  private async countLike(commentId: number) {
    const likeCount = db.commentLike.count({ where: { commentId } })
    return likeCount
  }
}
export default CommentLikeService
