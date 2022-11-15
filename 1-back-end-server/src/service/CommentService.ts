import db from '../common/config/prisma/db-client.js'

class CommentService {
  private static instance: CommentService

  static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService()
    }
    return CommentService.instance
  }

  private constructor() {}

  async createComment({
    itemId,
    text,
    userId,
    parentCommentId,
  }: CreateCommentParams) {
    //
  }

  async getCommentList() {
    //
  }

  async getSubcommentList(commentId: number) {
    //
  }

  async updateComment({ userId, commentId, text }: UpdateCommentParams) {
    //
  }

  async deleteComment({ userId, commentId }: CommentParams) {
    //
  }

  async likeComment({ userId, commentId }: CommentParams) {
    //
  }

  async unlikeComment({ userId, commentId }: CommentParams) {
    //
  }
}
export default CommentService

// types

type CreateCommentParams = {
  itemId: number
  text: string
  userId: number
  parentCommentId?: number
}

type UpdateCommentParams = CommentParams & {
  text: string
}

type CommentParams = {
  commentId: number
  userId: number
}
