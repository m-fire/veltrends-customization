import db from '../common/config/prisma/db-client.js'
import { Comment } from '@prisma/client'
import AppError from '../common/error/AppError.js'
import CommentLikeService from './CommentLikeService.js'
import ItemStatusService from './ItemStatusService.js'

// prisma include conditions
const INCLUDE_SIMPLE_USER = { select: { id: true, username: true } } as const

class CommentService {
  private static instance: CommentService
  private commentLikeService = CommentLikeService.getInstance()
  private itemStatusSerivce = ItemStatusService.getInstance()

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
    CommentService.validateTextLength(text)

    const parentComment =
      parentCommentId != null ? await this.getComment(parentCommentId) : null
    const rootId = parentComment?.parentCommentId
    const parentId = rootId ?? parentCommentId
    const mentionUserId = parentComment?.userId

    const isSubcomment = parentId != null
    // 등록할 댓글이 하위댓글 이면서, 자신이 아닌 남을 언급했을경우, mention 허용!
    const shouldMentionUser =
      isSubcomment && mentionUserId != null && mentionUserId !== userId

    const newComment = await db.comment.create({
      data: {
        itemId,
        text,
        userId,
        parentCommentId: isSubcomment ? parentId : null,
        mentionUserId: shouldMentionUser ? mentionUserId : null,
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

    await this.syncCommentCount(itemId)

    return { ...newComment, isDeleted: false, subcommentList: [] }
  }

  async getCommentList(itemId: number) {
    const commentList = await db.comment.findMany({
      where: { itemId },
      orderBy: { id: 'asc' },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })
    // normalize ation 가공
    const normalizedList = this.normalizeDeletedCommentInList(commentList)
    const composedCommentList = await this.composeSubcomments(normalizedList)
    return composedCommentList
  }

  private normalizeDeletedCommentInList(comments: Comment[]): Comment[] {
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

  private async composeSubcomments(comments: Comment[]) {
    const rootComments = comments.filter((c) => c.parentCommentId == null)
    const commentsByParentIdMap = new Map<number, Comment[]>()

    comments.forEach((c) => {
      if (!c.parentCommentId) return
      if (c.deletedAt != null) return
      const subComments = commentsByParentIdMap.get(c.parentCommentId) ?? []
      subComments.push(c)
      commentsByParentIdMap.set(c.parentCommentId, subComments)
    })
    const composedList = rootComments
      .map((c) => ({
        ...c,
        subcommentList: commentsByParentIdMap.get(c.id) ?? [],
      }))
      .filter((c) => {
        return c.deletedAt == null || c.subcommentList.length > 0
      })

    return composedList
  }

  async getComment(commentId: number, includeSubcomments: boolean = false) {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })
    if (!comment || comment.deletedAt) throw new AppError('NotFoundError')
    if (!includeSubcomments) return comment

    const subcommentList = await this.getSubcommentList(commentId)
    return { ...comment, subcommentList }
  }

  async getSubcommentList(parentId: number) {
    return db.comment.findMany({
      where: { parentCommentId: parentId },
      orderBy: { id: 'asc' },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })
  }

  async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    const comment = await this.getComment(commentId)
    if (comment!.id !== commentId) new AppError('ForbiddenError')

    await db.comment.update({
      where: { id: commentId },
      data: { text },
      include: { user: INCLUDE_SIMPLE_USER },
    })
    return this.getComment(commentId, true)
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment(commentId)
    if (comment!.id !== commentId) new AppError('ForbiddenError')

    await db.comment.delete({ where: { id: commentId } })

    await this.syncCommentCount(comment.itemId)
  }

  async likeComment({ commentId, userId }: LikeCommentParams) {
    const likeCount = await this.commentLikeService.like({ commentId, userId })
    await this.syncLikeCount({ commentId, likeCount })
    return likeCount
  }

  async unlikeComment({ commentId, userId }: UnlikeCommentParams) {
    const likeCount = await this.commentLikeService.unlike({
      commentId,
      userId,
    })
    await this.syncLikeCount({ commentId, likeCount })
    return likeCount
  }

  private async syncLikeCount({ commentId, likeCount }: UpdateLikeCountParams) {
    await db.comment.update({
      data: { likeCount },
      where: { id: commentId },
    })
  }

  private async syncCommentCount(itemId: number) {
    const commentCount = await db.comment.count({
      where: { itemId },
    })
    await this.itemStatusSerivce.updateCommentCount({
      itemId,
      commentCount,
    })
  }

  private static validateTextLength(text: string) {
    const textLength = text.length
    if (textLength > 300 || textLength === 0) {
      throw new AppError('BadReqeustError', { message: 'text is invalid' })
    }
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

type UpdateLikeCountParams = { commentId: number; likeCount: number }

export type LikeCommentParams = {
  commentId: number
  userId: number
}

export type UnlikeCommentParams = LikeCommentParams
