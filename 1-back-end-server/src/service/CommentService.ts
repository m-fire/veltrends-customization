import db from '../common/config/prisma/db-client.js'
import { Comment } from '@prisma/client'
import AppError from '../common/error/AppError.js'
import CommentLikeService from './CommentLikeService.js'

class CommentService {
  private static instance: CommentService
  private commentLikeService = CommentLikeService.getInstance()

  static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService()
    }
    return CommentService.instance
  }

  private constructor() {}

  async createComment({
    itemId,
    userId,
    text,
    parentCommentId,
  }: CreateCommentParams) {
    const parentCommentOrNull = parentCommentId
      ? await this.getComment(parentCommentId)
      : null

    const rootIdOrNull = parentCommentOrNull?.parentCommentId ?? null

    const comment = db.comment.create({
      data: {
        itemId,
        text,
        userId,
        parentCommentId: rootIdOrNull ?? parentCommentId,
        mentionUserId: parentCommentOrNull?.userId,
      },
      include: { user: { select: { id: true } } },
    })
    if (parentCommentId == null) return comment

    // update subcomment count
    const subcommentCount = await db.comment.count({
      where: { parentCommentId },
    })
    await db.comment.update({
      where: { id: parentCommentId },
      data: { subcommentCount },
    })

    return comment
  }

  async getComment(commentId: number) {
    const comment = db.comment.findUnique({
      where: { id: commentId },
    })
    if (!comment) throw new AppError('NotFoundError')
    return comment
  }

  async getCommentList(itemId: number) {
    return db.comment.findMany({
      where: { itemId },
      orderBy: { id: 'asc' },
      include: { user: { select: { id: true } } },
    })
  }

  async getSubcommentList(parentId: number) {
    return db.comment.findMany({
      where: { parentCommentId: parentId },
      orderBy: { id: 'asc' },
      include: { user: { select: { id: true } } },
    })
  }

  async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    const comment = await this.getComment(commentId)
    if (comment!.id !== commentId) new AppError('ForbiddenError')

    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: { text },
      include: { user: { select: { id: true } } },
    })
    return updatedComment
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment(commentId)
    if (comment!.id !== commentId) new AppError('ForbiddenError')

    await db.comment.delete({ where: { id: commentId } })
  }

  async likeComment(params: CommentParams) {
    const likes = await this.commentLikeService.like(params)
    return likes
  }

  async unlikeComment(params: CommentParams) {
    const likes = await this.commentLikeService.unlike(params)
    return likes
  }
}
export default CommentService

// types

type CreateCommentParams = {
  itemId: number
  userId: number
  text: string
  parentCommentId?: number
}

export type CommentParams = {
  commentId: number
  userId: number
}

type UpdateCommentParams = CommentParams & {
  text: string
}
